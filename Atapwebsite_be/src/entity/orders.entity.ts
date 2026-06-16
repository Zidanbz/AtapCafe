import type { Prisma } from "@prisma/client";

export const orderDetailsInclude = {
  table: true,
  items: true,
  payment: true,
} satisfies Prisma.OrderInclude;

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof orderDetailsInclude;
}>;
