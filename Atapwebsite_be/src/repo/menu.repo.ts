import { prisma } from "../config/database";

export async function findActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}

export async function findActiveCategoriesWithMenuItems(categorySlug?: string) {
  return prisma.category.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { slug: categorySlug } : {}),
    },
    include: {
      menuItems: {
        where: { isAvailable: true },
        orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      },
    },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
}
