export type MenuQuery = {
  category?: string;
};

export type MenuCategoryResponse = {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
};

export type MenuProductResponse = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type MenuResponse = {
  categories: MenuCategoryResponse[];
  products: MenuProductResponse[];
};
