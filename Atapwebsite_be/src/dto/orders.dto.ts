import type { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from "../entity/domain.entity";

export type CreateOrderBody = {
  tableCode?: string;
  customerName?: string;
  customerContact?: string;
  orderType?: "DINE_IN" | "TAKE_AWAY" | "dine_in" | "take_away";
  paymentMethod?: "QRIS" | "CASH" | "qris" | "cash";
  orderNote?: string;
  items?: Array<{
    menuItemId?: string;
    quantity?: number;
    note?: string;
  }>;
};

export type CreateOrderItemInput = {
  menuItemId: string;
  quantity: number;
  note?: string;
};

export type CreateOrderInput = {
  tableCode: string;
  customerName: string;
  customerContact?: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  orderNote?: string;
  items: CreateOrderItemInput[];
};

export type OrderItemResponse = {
  id: string;
  menuItemId: string | null;
  name: string;
  price: number;
  quantity: number;
  note: string | null;
  subtotal: number;
};

export type OrderResponse = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerContact: string | null;
  orderType: OrderType;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  additionalCost: number;
  total: number;
  orderNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  table: {
    id: string;
    code: string;
    area: string;
    status: string;
  } | null;
  items: OrderItemResponse[];
  payment: {
    id: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    paidAt: Date | null;
  } | null;
};
