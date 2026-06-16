import type { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { adminOrderInclude } from "../entity/admin.entity";
import type { AdminOrdersInput, CreateMenuItemInput, UpdateMenuItemInput, UpdateOrderStatusInput } from "../dto/admin.dto";

function getAdminOrdersWhere(input: AdminOrdersInput): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};

  if (input.search) {
    where.OR = [
      { orderNumber: { contains: input.search } },
      { customerName: { contains: input.search } },
      { customerContact: { contains: input.search } },
      { table: { is: { code: { contains: input.search } } } },
    ];
  }

  if (input.status) {
    where.status = input.status;
  }

  if (input.paymentStatus) {
    where.paymentStatus = input.paymentStatus;
  }

  if (input.dateFrom || input.dateTo) {
    where.createdAt = {
      gte: input.dateFrom,
      lte: input.dateTo,
    };
  }

  return where;
}

export async function findAdminOrders(input: AdminOrdersInput) {
  const where = getAdminOrdersWhere(input);

  return prisma.order.findMany({
    where,
    include: adminOrderInclude,
    orderBy: { createdAt: "desc" },
    skip: (input.page - 1) * input.take,
    take: input.take,
  });
}

export async function countAdminOrders(input: AdminOrdersInput) {
  return prisma.order.count({
    where: getAdminOrdersWhere(input),
  });
}

export async function findActiveAdminUserByUsername(username: string) {
  return prisma.adminUser.findFirst({
    where: {
      username,
      isActive: true,
    },
  });
}

export async function findActiveAdminUserById(id: string) {
  return prisma.adminUser.findFirst({
    where: {
      id,
      isActive: true,
    },
  });
}

export async function updateAdminPasswordHash(id: string, passwordHash: string) {
  return prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function updateOrderStatus(input: UpdateOrderStatusInput) {
  return prisma.order.update({
    where: { id: input.id },
    data: {
      status: input.status,
      paymentStatus: input.paymentStatus,
      payment: input.paymentStatus
        ? {
            update: {
              status: input.paymentStatus,
              paidAt: input.paymentStatus === "PAID" ? new Date() : undefined,
            },
          }
        : undefined,
    },
    include: adminOrderInclude,
  });
}

export async function deleteOrderById(id: string) {
  return prisma.order.delete({
    where: { id },
    include: adminOrderInclude,
  });
}

export async function getAdminStats() {
  const [totalOrders, paidOrders, activeMenuItems] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.menuItem.count({
      where: { isAvailable: true },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: paidOrders._sum.total ?? 0,
    activeMenuItems,
  };
}

export async function findAdminMenuCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}

export async function findAdminMenuItems() {
  return prisma.menuItem.findMany({
    where: {
      NOT: {
        slug: {
          startsWith: "deleted-",
        },
      },
    },
    include: { category: true },
    orderBy: [{ isAvailable: "desc" }, { isFeatured: "desc" }, { name: "asc" }],
  });
}

export async function findMenuItemBySlug(slug: string) {
  return prisma.menuItem.findUnique({
    where: { slug },
  });
}

export async function createMenuItem(input: CreateMenuItemInput & { slug: string }) {
  return prisma.menuItem.create({
    data: input,
    include: { category: true },
  });
}

export async function updateMenuItem(input: UpdateMenuItemInput & { slug?: string }) {
  const { id, ...data } = input;

  return prisma.menuItem.update({
    where: { id },
    data,
    include: { category: true },
  });
}

export async function deleteMenuItem(id: string) {
  return prisma.$transaction(async (tx) => {
    await tx.orderItem.updateMany({
      where: { menuItemId: id },
      data: { menuItemId: null },
    });

    return tx.menuItem.delete({
      where: { id },
      include: { category: true },
    });
  });
}
