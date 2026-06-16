import type {
  AdminLoginInput,
  AdminOrdersInput,
  CreateMenuItemInput,
  UpdateAdminPasswordInput,
  UpdateMenuItemInput,
  UpdateOrderStatusInput,
} from "../dto/admin.dto";
import { createAdminToken } from "../helper/auth-token.helper";
import { mapAdminMenuItem, mapAdminOrder, mapAdminUser } from "../helper/admin.mapper";
import { hashPassword, verifyPassword } from "../helper/password.helper";
import {
  countAdminOrders,
  createMenuItem,
  deleteOrderById,
  deleteMenuItem,
  findActiveAdminUserById,
  findActiveAdminUserByUsername,
  findAdminOrders,
  findAdminMenuCategories,
  findAdminMenuItems,
  findMenuItemBySlug,
  getAdminStats,
  updateMenuItem,
  updateAdminPasswordHash,
  updateOrderStatus,
} from "../repo/admin.repo";
import { badRequest, notFound } from "../util/http-error";

export async function getAdminOrders(input: AdminOrdersInput) {
  const [orders, total] = await Promise.all([findAdminOrders(input), countAdminOrders(input)]);

  return {
    items: orders.map(mapAdminOrder),
    pagination: {
      page: input.page,
      take: input.take,
      total,
      totalPages: Math.max(Math.ceil(total / input.take), 1),
    },
  };
}

export async function loginAdmin(input: AdminLoginInput) {
  const admin = await findActiveAdminUserByUsername(input.username);

  if (!admin || !verifyPassword(input.password, admin.passwordHash)) {
    throw badRequest("Invalid admin username or password.");
  }

  if (!admin.passwordHash.startsWith("scrypt$")) {
    await updateAdminPasswordHash(admin.id, hashPassword(input.password));
  }

  return {
    token: createAdminToken({
      sub: admin.id,
      username: admin.username,
      role: admin.role,
    }),
    user: mapAdminUser(admin),
  };
}

export async function getAdminProfile(adminId: string) {
  const admin = await findActiveAdminUserById(adminId);

  if (!admin) {
    throw notFound("Admin user not found.");
  }

  return mapAdminUser(admin);
}

export async function changeAdminPassword(adminId: string, input: UpdateAdminPasswordInput) {
  const admin = await findActiveAdminUserById(adminId);

  if (!admin) {
    throw notFound("Admin user not found.");
  }

  if (!verifyPassword(input.currentPassword, admin.passwordHash)) {
    throw badRequest("Current password is incorrect.");
  }

  await updateAdminPasswordHash(admin.id, hashPassword(input.newPassword));

  return mapAdminUser(admin);
}

export async function updateAdminOrderStatus(input: UpdateOrderStatusInput) {
  try {
    const order = await updateOrderStatus(input);

    return mapAdminOrder(order);
  } catch {
    throw notFound("Order not found.");
  }
}

export async function deleteAdminOrder(id: string) {
  try {
    const order = await deleteOrderById(id);

    return mapAdminOrder(order);
  } catch {
    throw notFound("Order not found.");
  }
}

export async function getAdminDashboardStats() {
  return getAdminStats();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createUniqueMenuSlug(name: string, currentId?: string) {
  const baseSlug = slugify(name) || `menu-${Date.now()}`;
  let slug = baseSlug;
  let index = 1;

  while (true) {
    const existing = await findMenuItemBySlug(slug);

    if (!existing || existing.id === currentId) {
      return slug;
    }

    index += 1;
    slug = `${baseSlug}-${index}`;
  }
}

export async function getAdminMenu() {
  const [categories, items] = await Promise.all([findAdminMenuCategories(), findAdminMenuItems()]);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    })),
    items: items.map(mapAdminMenuItem),
  };
}

export async function createAdminMenuItem(input: CreateMenuItemInput) {
  try {
    const item = await createMenuItem({
      ...input,
      slug: await createUniqueMenuSlug(input.name),
    });

    return mapAdminMenuItem(item);
  } catch {
    throw badRequest("Menu item could not be created.");
  }
}

export async function updateAdminMenuItem(input: UpdateMenuItemInput) {
  try {
    const item = await updateMenuItem({
      ...input,
      slug: input.name ? await createUniqueMenuSlug(input.name, input.id) : undefined,
    });

    return mapAdminMenuItem(item);
  } catch {
    throw notFound("Menu item not found.");
  }
}

export async function deleteAdminMenuItem(id: string) {
  try {
    const item = await deleteMenuItem(id);

    return mapAdminMenuItem(item);
  } catch {
    try {
      const item = await updateMenuItem({
        id,
        slug: `deleted-${id}`,
        isAvailable: false,
        isFeatured: false,
      });

      return mapAdminMenuItem(item);
    } catch {
      throw notFound("Menu item not found.");
    }
  }
}
