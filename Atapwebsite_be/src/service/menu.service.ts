import { mapCategory, mapMenu } from "../helper/menu.mapper";
import { findActiveCategories, findActiveCategoriesWithMenuItems } from "../repo/menu.repo";

export async function getCategories() {
  const categories = await findActiveCategories();

  return categories.map(mapCategory);
}

export async function getMenu(categorySlug?: string) {
  const categories = await findActiveCategoriesWithMenuItems(categorySlug);

  return mapMenu(categories);
}
