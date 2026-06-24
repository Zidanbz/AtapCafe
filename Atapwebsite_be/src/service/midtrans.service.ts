import { createHash } from "node:crypto";
import type { OrderWithDetails, PaymentStatus } from "../entity/domain.entity";
import { badRequest } from "../util/http-error";

export type MidtransSnapResponse = {
  token: string;
  redirect_url: string;
};

type MidtransNotificationBody = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  settlement_time?: string;
};

function isProduction() {
  return process.env.MIDTRANS_IS_PRODUCTION === "true";
}

export function getMidtransSnapJsUrl() {
  return isProduction() ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
}

function getMidtransSnapApiUrl() {
  return isProduction()
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

function getServerKey() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    throw badRequest("Midtrans server key is not configured.");
  }

  return serverKey;
}

function createAuthorizationHeader() {
  return "Basic " + Buffer.from(getServerKey() + ":").toString("base64");
}

function splitCustomerName(name: string | null) {
  const value = name?.trim() || "Customer Atap";
  const [firstName, ...rest] = value.split(/\s+/);

  return {
    firstName: firstName || value,
    lastName: rest.join(" ") || undefined,
  };
}

export async function createMidtransSnapTransaction(order: OrderWithDetails) {
  const customer = splitCustomerName(order.customerName);
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  console.info("midtrans.snap.create.start", { orderId: order.id, amount: order.total, production: isProduction() });

  let response: Response;

  try {
    response = await fetch(getMidtransSnapApiUrl(), {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: createAuthorizationHeader(),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: order.id,
        gross_amount: order.total,
      },
      customer_details: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        phone: order.customerContact || undefined,
      },
      item_details: order.items.map((item) => ({
        id: item.menuItemId || item.id,
        price: item.priceSnapshot,
        quantity: item.quantity,
        name: item.nameSnapshot.slice(0, 50),
      })),
      callbacks: {
        finish: process.env.MIDTRANS_FINISH_URL || undefined,
      },
    }),
    signal: controller.signal,
  });
  } catch (error) {
    console.error("midtrans.snap.create.error", {
      orderId: order.id,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error),
    });

    throw badRequest(error instanceof Error && error.name === "AbortError" ? "Midtrans request timed out." : "Midtrans request failed.");
  } finally {
    clearTimeout(timeout);
  }

  console.info("midtrans.snap.create.response", { orderId: order.id, status: response.status, durationMs: Date.now() - startedAt });

  const payload = (await response.json().catch(() => null)) as (Partial<MidtransSnapResponse> & {
    error_messages?: string[];
    status_message?: string;
  }) | null;

  if (!response.ok || !payload?.token || !payload.redirect_url) {
    const message = payload?.error_messages?.join(" ") || payload?.status_message || "Midtrans transaction could not be created.";
    throw badRequest(message);
  }

  return {
    token: payload.token,
    redirectUrl: payload.redirect_url,
  };
}

export function verifyMidtransNotification(input: MidtransNotificationBody) {
  const orderId = input.order_id;
  const statusCode = input.status_code;
  const grossAmount = input.gross_amount;
  const signatureKey = input.signature_key;

  if (!orderId || !statusCode || !grossAmount || !signatureKey) {
    throw badRequest("Invalid Midtrans notification payload.");
  }

  const expected = createHash("sha512").update(orderId + statusCode + grossAmount + getServerKey()).digest("hex");

  if (expected !== signatureKey) {
    throw badRequest("Invalid Midtrans notification signature.");
  }

  return {
    orderId,
    statusCode,
    grossAmount,
    transactionStatus: input.transaction_status || "",
    fraudStatus: input.fraud_status || "",
    paymentType: input.payment_type || null,
    transactionId: input.transaction_id || null,
    transactionTime: input.transaction_time || null,
    settlementTime: input.settlement_time || null,
  };
}

export function mapMidtransPaymentStatus(transactionStatus: string, fraudStatus: string): PaymentStatus {
  if (transactionStatus === "capture") {
    return fraudStatus === "challenge" ? "PENDING" : "PAID";
  }

  if (transactionStatus === "settlement") {
    return "PAID";
  }

  if (transactionStatus === "pending") {
    return "PENDING";
  }

  if (["deny", "cancel", "expire", "failure"].includes(transactionStatus)) {
    return "FAILED";
  }

  return "PENDING";
}
