import type { OrderWithDetails } from "../entity/orders.entity";
import type { OrderResponse } from "../dto/orders.dto";

export function mapOrder(order: OrderWithDetails): OrderResponse {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerContact: order.customerContact,
    orderType: order.orderType,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    additionalCost: order.additionalCost,
    total: order.total,
    orderNote: order.orderNote,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    table: order.table
      ? {
          id: order.table.id,
          code: order.table.code,
          area: order.table.area,
          status: order.table.status,
        }
      : null,
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      name: item.nameSnapshot,
      price: item.priceSnapshot,
      quantity: item.quantity,
      note: item.note,
      subtotal: item.subtotal,
    })),
    payment: order.payment
      ? {
          id: order.payment.id,
          method: order.payment.method,
          status: order.payment.status,
          amount: order.payment.amount,
          paidAt: order.payment.paidAt,
        }
      : null,
  };
}
