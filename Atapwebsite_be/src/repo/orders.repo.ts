import type { Prisma } from "@prisma/client";
import { TableStatus } from "@prisma/client";
import { prisma } from "../config/database";
import { orderDetailsInclude } from "../entity/orders.entity";

export async function findAvailableMenuItemsByIds(ids: string[]) {
  return prisma.menuItem.findMany({
    where: {
      id: { in: ids },
      isAvailable: true,
    },
  });
}

export async function upsertDiningTable(code: string, area: string) {
  return prisma.diningTable.upsert({
    where: { code },
    update: {},
    create: {
      code,
      area,
      status: TableStatus.AVAILABLE,
    },
  });
}

export async function createOrderWithDetails(data: Prisma.OrderCreateInput) {
  return prisma.order.create({
    data,
    include: orderDetailsInclude,
  });
}
