import { randomUUID } from "crypto";
import { db, dateToFirestore, firestoreToDate, mapDoc } from "../config/database";
import {
  PaymentStatus,
  TableStatus,
  type DiningTable,
  type MenuItem,
  type OrderItem,
  type OrderWithDetails,
  type Payment,
  type PaymentStatus as PaymentStatusType,
} from "../entity/domain.entity";

type CreateOrderItemData = Pick<OrderItem, "menuItemId" | "nameSnapshot" | "priceSnapshot" | "quantity" | "note" | "subtotal">;

type CreateOrderData = Omit<OrderWithDetails, "id" | "createdAt" | "updatedAt" | "items" | "payment" | "table" | "tableId"> & {
  tableId: string | null;
  items: CreateOrderItemData[];
  payment: Pick<Payment, "method" | "status" | "amount">;
};

function normalizeMenuItem(menuItem: MenuItem): MenuItem {
  return {
    ...menuItem,
    isAvailable: menuItem.isAvailable ?? true,
    isFeatured: menuItem.isFeatured ?? false,
    createdAt: firestoreToDate(menuItem.createdAt),
    updatedAt: firestoreToDate(menuItem.updatedAt),
  };
}

function normalizeTable(table: DiningTable): DiningTable {
  return {
    ...table,
    status: table.status ?? TableStatus.AVAILABLE,
    createdAt: firestoreToDate(table.createdAt),
    updatedAt: firestoreToDate(table.updatedAt),
  };
}

export function normalizeOrder(order: Omit<OrderWithDetails, "table">): Omit<OrderWithDetails, "table"> {
  return {
    ...order,
    tableId: order.tableId ?? null,
    customerName: order.customerName ?? null,
    customerContact: order.customerContact ?? null,
    additionalCost: order.additionalCost ?? 0,
    orderNote: order.orderNote ?? null,
    createdAt: firestoreToDate(order.createdAt),
    updatedAt: firestoreToDate(order.updatedAt),
    items: (order.items ?? []).map((item) => ({
      ...item,
      menuItemId: item.menuItemId ?? null,
      note: item.note ?? null,
      createdAt: firestoreToDate(item.createdAt),
    })),
    payment: order.payment
      ? {
          ...order.payment,
          paidAt: order.payment.paidAt ? firestoreToDate(order.payment.paidAt) : null,
          createdAt: firestoreToDate(order.payment.createdAt),
          updatedAt: firestoreToDate(order.payment.updatedAt),
        }
      : null,
  };
}

export async function attachOrderDetails(order: Omit<OrderWithDetails, "table">): Promise<OrderWithDetails> {
  const normalized = normalizeOrder(order);
  const table = normalized.tableId
    ? await db
        .collection("diningTables")
        .doc(normalized.tableId)
        .get()
        .then((doc) => (doc.exists ? normalizeTable({ id: doc.id, ...doc.data() } as DiningTable) : null))
    : null;

  return {
    ...normalized,
    table,
  };
}

export async function findAvailableMenuItemsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const refs = ids.map((id) => db.collection("menuItems").doc(id));
  const snapshots = await db.getAll(...refs);

  return snapshots
    .filter((snapshot) => snapshot.exists)
    .map((snapshot) => normalizeMenuItem({ id: snapshot.id, ...snapshot.data() } as MenuItem))
    .filter((menuItem) => menuItem.isAvailable);
}

export async function upsertDiningTable(code: string, area: string) {
  const snapshot = await db.collection("diningTables").where("code", "==", code).limit(1).get();
  const now = new Date();

  if (!snapshot.empty) {
    return normalizeTable(mapDoc<DiningTable>(snapshot.docs[0]));
  }

  const ref = db.collection("diningTables").doc();
  const table: Omit<DiningTable, "id"> = {
    code,
    area,
    status: TableStatus.AVAILABLE,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set({
    ...table,
    createdAt: dateToFirestore(table.createdAt),
    updatedAt: dateToFirestore(table.updatedAt),
  });

  return normalizeTable({ id: ref.id, ...table });
}

export async function createOrderWithDetails(data: CreateOrderData) {
  const now = new Date();
  const orderRef = db.collection("orders").doc();
  const payment: Payment = {
    id: randomUUID(),
    orderId: orderRef.id,
    method: data.payment.method,
    status: data.payment.status,
    amount: data.payment.amount,
    paidAt: data.payment.status === PaymentStatus.PAID ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  const items: OrderItem[] = data.items.map((item) => ({
    id: randomUUID(),
    orderId: orderRef.id,
    menuItemId: item.menuItemId,
    nameSnapshot: item.nameSnapshot,
    priceSnapshot: item.priceSnapshot,
    quantity: item.quantity,
    note: item.note ?? null,
    subtotal: item.subtotal,
    createdAt: now,
  }));
  const order = {
    orderNumber: data.orderNumber,
    tableId: data.tableId,
    customerName: data.customerName,
    customerContact: data.customerContact,
    orderType: data.orderType,
    status: data.status,
    paymentStatus: data.paymentStatus,
    subtotal: data.subtotal,
    additionalCost: data.additionalCost,
    total: data.total,
    orderNote: data.orderNote,
    createdAt: now,
    updatedAt: now,
    items,
    payment,
  };

  await orderRef.set({
    ...order,
    createdAt: dateToFirestore(order.createdAt),
    updatedAt: dateToFirestore(order.updatedAt),
    items: items.map((item) => ({
      ...item,
      createdAt: dateToFirestore(item.createdAt),
    })),
    payment: {
      ...payment,
      paidAt: dateToFirestore(payment.paidAt),
      createdAt: dateToFirestore(payment.createdAt),
      updatedAt: dateToFirestore(payment.updatedAt),
    },
  });

  return attachOrderDetails({
    id: orderRef.id,
    ...order,
  });
}


export async function updateOrderMidtransSnap(id: string, input: { token: string; redirectUrl: string }) {
  const ref = db.collection("orders").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Order not found.");
  }

  const order = normalizeOrder({ id: doc.id, ...doc.data() } as Omit<OrderWithDetails, "table">);
  const now = new Date();
  const payment = order.payment
    ? {
        ...order.payment,
        midtransToken: input.token,
        midtransRedirectUrl: input.redirectUrl,
        updatedAt: now,
      }
    : null;

  await ref.update({
    payment: payment
      ? {
          ...payment,
          paidAt: dateToFirestore(payment.paidAt),
          createdAt: dateToFirestore(payment.createdAt),
          updatedAt: dateToFirestore(payment.updatedAt),
        }
      : null,
    updatedAt: dateToFirestore(now),
  });
}

export async function updateOrderPaymentFromMidtrans(
  id: string,
  input: {
    paymentStatus: PaymentStatusType;
    transactionStatus: string;
    fraudStatus: string;
    paymentType: string | null;
    transactionId: string | null;
    transactionTime: string | null;
    settlementTime: string | null;
  },
) {
  const ref = db.collection("orders").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Order not found.");
  }

  const order = normalizeOrder({ id: doc.id, ...doc.data() } as Omit<OrderWithDetails, "table">);
  const now = new Date();
  const paidAt = input.paymentStatus === "PAID" ? new Date(input.settlementTime || input.transactionTime || now) : order.payment?.paidAt ?? null;
  const payment = order.payment
    ? {
        ...order.payment,
        status: input.paymentStatus,
        paidAt,
        midtransTransactionStatus: input.transactionStatus,
        midtransFraudStatus: input.fraudStatus,
        midtransPaymentType: input.paymentType,
        midtransTransactionId: input.transactionId,
        updatedAt: now,
      }
    : null;

  await ref.update({
    paymentStatus: input.paymentStatus,
    status: input.paymentStatus === "PAID" ? "IN_PROCESS" : order.status,
    payment: payment
      ? {
          ...payment,
          paidAt: dateToFirestore(payment.paidAt),
          createdAt: dateToFirestore(payment.createdAt),
          updatedAt: dateToFirestore(payment.updatedAt),
        }
      : null,
    updatedAt: dateToFirestore(now),
  });

  const updated = await ref.get();
  return attachOrderDetails({ id: updated.id, ...updated.data() } as Omit<OrderWithDetails, "table">);
}
