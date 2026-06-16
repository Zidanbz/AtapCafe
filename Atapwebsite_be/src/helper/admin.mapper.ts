import type { AdminOrderWithDetails } from "../entity/admin.entity";
import type { AdminMenuItemResponse, AdminOrderResponse, AdminUserResponse } from "../dto/admin.dto";
import { mapOrder } from "./orders.mapper";
import type { AdminUser, Category, MenuItem } from "@prisma/client";

export function mapAdminOrder(order: AdminOrderWithDetails): AdminOrderResponse {
  return mapOrder(order);
}

export function mapAdminUser(user: AdminUser): AdminUserResponse {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

export function mapAdminMenuItem(menuItem: MenuItem & { category: Category }): AdminMenuItemResponse {
  return {
    id: menuItem.id,
    categoryId: menuItem.categoryId,
    name: menuItem.name,
    slug: menuItem.slug,
    description: menuItem.description,
    price: menuItem.price,
    imageUrl: menuItem.imageUrl,
    isAvailable: menuItem.isAvailable,
    isFeatured: menuItem.isFeatured,
    category: {
      id: menuItem.category.id,
      name: menuItem.category.name,
      slug: menuItem.category.slug,
    },
  };
}
