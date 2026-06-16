import { OrderStatus, OrderType, PaymentStatus } from "@prisma/client";
import type { CreateOrderInput } from "../dto/orders.dto";
import { createOrderNumber } from "../helper/order-number.helper";
import { mapOrder } from "../helper/orders.mapper";
import { getTableArea } from "../helper/table.helper";
import { createOrderWithDetails, findAvailableMenuItemsByIds, upsertDiningTable } from "../repo/orders.repo";
import { badRequest } from "../util/http-error";

export async function createOrder(input: CreateOrderInput) {
  const menuItemIds = [...new Set(input.items.map((item) => item.menuItemId))];
  const menuItems = await findAvailableMenuItemsByIds(menuItemIds);

  if (menuItems.length !== menuItemIds.length) {
    throw badRequest("Some menu items are unavailable or not found.");
  }

  const menuItemById = new Map(menuItems.map((menuItem) => [menuItem.id, menuItem]));
  const orderItems = input.items.map((item) => {
    const menuItem = menuItemById.get(item.menuItemId);

    if (!menuItem) {
      throw badRequest("Menu item not found.");
    }

    return {
      menuItemId: menuItem.id,
      nameSnapshot: menuItem.name,
      priceSnapshot: menuItem.price,
      quantity: item.quantity,
      note: item.note,
      subtotal: menuItem.price * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((total, item) => total + item.subtotal, 0);
  const additionalCost = 0;
  const total = subtotal + additionalCost;
  const paymentStatus = input.paymentMethod === "QRIS" ? PaymentStatus.PENDING : PaymentStatus.UNPAID;
  const table =
    input.orderType === OrderType.DINE_IN ? await upsertDiningTable(input.tableCode, getTableArea(input.tableCode)) : null;
  const order = await createOrderWithDetails({
    orderNumber: createOrderNumber(),
    table: table ? { connect: { id: table.id } } : undefined,
    customerName: input.customerName ?? null,
    customerContact: input.customerContact ?? null,
    orderType: input.orderType,
    status: OrderStatus.PENDING,
    paymentStatus,
    subtotal,
    additionalCost,
    total,
    orderNote: input.orderNote ?? null,
    items: {
      create: orderItems,
    },
    payment: {
      create: {
        method: input.paymentMethod,
        status: paymentStatus,
        amount: total,
      },
    },
  });

  return mapOrder(order);
}
