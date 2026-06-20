import type { AdminRole, OrderStatus, PaymentStatus } from "../entity/domain.entity";
import type { OrderResponse } from "./orders.dto";

export type AdminOrdersQuery = {
  search?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
  take?: string;
};

export type AdminOrdersInput = {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page: number;
  take: number;
};

export type AdminOrderResponse = OrderResponse;

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    take: number;
    total: number;
    totalPages: number;
  };
};

export type AdminLoginBody = {
  username?: string;
  password?: string;
};

export type AdminLoginInput = {
  username: string;
  password: string;
};

export type AdminUserResponse = {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
};

export type AdminLoginResponse = {
  token: string;
  user: AdminUserResponse;
};

export type UpdateOrderStatusBody = {
  status?: string;
  paymentStatus?: string;
};

export type UpdateOrderStatusParams = {
  id: string;
};

export type OrderIdParams = {
  id: string;
};

export type UpdateOrderStatusInput = {
  id: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
};

export type UpdateAdminPasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

export type UpdateAdminPasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type AdminStatsResponse = {
  totalOrders: number;
  totalRevenue: number;
  activeMenuItems: number;
};

export type AdminMenuItemResponse = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type AdminMenuResponse = {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  items: AdminMenuItemResponse[];
};

export type UploadImageResponse = {
  imageUrl: string;
};

export type MenuItemBody = {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
};

export type CreateMenuItemInput = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

export type UpdateMenuItemInput = {
  id: string;
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
};

export type MenuItemParams = {
  id: string;
};
