export type OrderStatus = "Selesai" | "Di Proses" | "Belum bayar" | "Batal";

export type PaymentMethod = "QRIS" | "Tunai";

export type RawPaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED";

export type AdminOrder = {
  id: string;
  orderId: string;
  rawStatus: "PENDING" | "IN_PROCESS" | "COMPLETED" | "CANCELLED";
  rawPaymentStatus: RawPaymentStatus;
  customerName: string;
  contact: string;
  table: string;
  orderType: "Dine In" | "Take Away";
  items: string[];
  total: number;
  method: PaymentMethod;
  time: string;
  status: OrderStatus;
};

export type AdminUser = {
  id: string;
  name: string;
  username: string;
  role: "Pemilik" | "Staff";
  initial: string;
  removable?: boolean;
};

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  activeMenuItems: number;
};

export type AdminMenuCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AdminMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: AdminMenuCategory;
};
