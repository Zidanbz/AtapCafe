export const TableStatus = {
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  INACTIVE: "INACTIVE",
} as const;

export const AdminRole = {
  OWNER: "OWNER",
  STAFF: "STAFF",
} as const;

export const OrderType = {
  DINE_IN: "DINE_IN",
  TAKE_AWAY: "TAKE_AWAY",
} as const;

export const OrderStatus = {
  PENDING: "PENDING",
  IN_PROCESS: "IN_PROCESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PaymentMethod = {
  QRIS: "QRIS",
  CASH: "CASH",
} as const;

export const PaymentStatus = {
  UNPAID: "UNPAID",
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;

export type TableStatus = (typeof TableStatus)[keyof typeof TableStatus];
export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole];
export type OrderType = (typeof OrderType)[keyof typeof OrderType];
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export type Category = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DiningTable = {
  id: string;
  code: string;
  area: string;
  status: TableStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  menuItemId: string | null;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  note: string | null;
  subtotal: number;
  createdAt: Date;
};

export type Payment = {
  id: string;
  orderId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Order = {
  id: string;
  orderNumber: string;
  tableId: string | null;
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
  items: OrderItem[];
  payment: Payment | null;
};

export type OrderWithDetails = Order & {
  table: DiningTable | null;
};

export type MenuCategoryWithItems = Category & {
  menuItems: MenuItem[];
};

export type AdminMenuItemWithCategory = MenuItem & {
  category: Category;
};
