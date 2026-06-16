import type { findActiveCategories, findActiveCategoriesWithMenuItems } from "../repo/menu.repo";

export type MenuCategory = Awaited<ReturnType<typeof findActiveCategories>>[number];
export type MenuCategoryWithItems = Awaited<ReturnType<typeof findActiveCategoriesWithMenuItems>>[number];
