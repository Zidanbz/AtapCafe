import { db, firestoreToDate, mapDoc } from "../config/database";
import type { Category, MenuCategoryWithItems, MenuItem } from "../entity/domain.entity";

function normalizeCategory(category: Category): Category {
  return {
    ...category,
    displayOrder: category.displayOrder ?? 0,
    isActive: category.isActive ?? true,
    createdAt: firestoreToDate(category.createdAt),
    updatedAt: firestoreToDate(category.updatedAt),
  };
}

function normalizeMenuItem(menuItem: MenuItem): MenuItem {
  return {
    ...menuItem,
    isAvailable: menuItem.isAvailable ?? true,
    isFeatured: menuItem.isFeatured ?? false,
    createdAt: firestoreToDate(menuItem.createdAt),
    updatedAt: firestoreToDate(menuItem.updatedAt),
  };
}

export async function findActiveCategories() {
  const snapshot = await db.collection("categories").where("isActive", "==", true).get();

  return snapshot.docs
    .map((doc) => normalizeCategory(mapDoc<Category>(doc)))
    .sort((left, right) => left.displayOrder - right.displayOrder || left.name.localeCompare(right.name));
}

export async function findActiveCategoriesWithMenuItems(categorySlug?: string) {
  const categories = (await findActiveCategories()).filter((category) => !categorySlug || category.slug === categorySlug);
  const itemsSnapshot = await db.collection("menuItems").where("isAvailable", "==", true).get();
  const items = itemsSnapshot.docs.map((doc) => normalizeMenuItem(mapDoc<MenuItem>(doc)));

  return categories.map<MenuCategoryWithItems>((category) => ({
    ...category,
    menuItems: items
      .filter((menuItem) => menuItem.categoryId === category.id)
      .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured) || left.name.localeCompare(right.name)),
  }));
}
