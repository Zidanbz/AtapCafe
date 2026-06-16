import type { Prisma } from "@prisma/client";

export const adminOrderInclude = {
  table: true,
  items: true,
  payment: true,
} satisfies Prisma.OrderInclude;

export type AdminOrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof adminOrderInclude;
}>;
