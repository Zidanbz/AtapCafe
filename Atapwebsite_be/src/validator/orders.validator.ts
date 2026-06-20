import { OrderType, PaymentMethod } from "../entity/domain.entity";
import type { CreateOrderBody, CreateOrderInput } from "../dto/orders.dto";
import { badRequest } from "../util/http-error";

function normalizeOrderType(value: CreateOrderBody["orderType"]) {
  if (!value || value === "DINE_IN" || value === "dine_in") {
    return OrderType.DINE_IN;
  }

  if (value === "TAKE_AWAY" || value === "take_away") {
    return OrderType.TAKE_AWAY;
  }

  throw badRequest("Invalid orderType.");
}

function normalizePaymentMethod(value: CreateOrderBody["paymentMethod"]) {
  if (!value || value === "QRIS" || value === "qris") {
    return PaymentMethod.QRIS;
  }

  if (value === "CASH" || value === "cash") {
    return PaymentMethod.CASH;
  }

  throw badRequest("Invalid paymentMethod.");
}

export function validateCreateOrderBody(body: CreateOrderBody): CreateOrderInput {
  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw badRequest("Order must contain at least one item.");
  }

  const customerName = body.customerName?.trim();

  if (!customerName) {
    throw badRequest("Customer name is required.");
  }

  return {
    tableCode: body.tableCode?.trim() || "IN-01",
    customerName,
    customerContact: body.customerContact?.trim() || undefined,
    orderType: normalizeOrderType(body.orderType),
    paymentMethod: normalizePaymentMethod(body.paymentMethod),
    orderNote: body.orderNote?.trim() || undefined,
    items: body.items.map((item) => {
      const menuItemId = item.menuItemId?.trim();
      const quantity = Number(item.quantity);

      if (!menuItemId) {
        throw badRequest("menuItemId is required for every item.");
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        throw badRequest("Item quantity must be between 1 and 99.");
      }

      return {
        menuItemId,
        quantity,
        note: item.note?.trim() || undefined,
      };
    }),
  };
}
