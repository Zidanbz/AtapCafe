import type { MenuCategory, MenuCategoryWithItems } from "../entity/menu.entity";
import type { MenuCategoryResponse, MenuResponse } from "../dto/menu.dto";

export function mapCategory(category: MenuCategory): MenuCategoryResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    displayOrder: category.displayOrder,
  };
}

export function mapMenu(categories: MenuCategoryWithItems[]): MenuResponse {
  return {
    categories: categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      displayOrder: category.displayOrder,
    })),
    products: categories.flatMap((category) =>
      category.menuItems.map((menuItem) => ({
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
          id: category.id,
          name: category.name,
          slug: category.slug,
        },
      })),
    ),
  };
}
