import type { Category, Product } from "@/features/ordering/types/menu";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiResponse<T> = {
  data: T;
};

type MenuApiCategory = {
  id: string;
  name: string;
  slug: string;
};

type MenuApiProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isFeatured: boolean;
  category: {
    name: string;
  };
};

type MenuApiResponse = {
  categories: MenuApiCategory[];
  products: MenuApiProduct[];
};

export type MenuData = {
  categories: Category[];
  products: Product[];
};

async function parseApiResponse<T>(response: Response) {
  const payload = (await response.json()) as ApiResponse<T> | { error?: string };

  if (!response.ok) {
    throw new Error("error" in payload && payload.error ? payload.error : "Request failed.");
  }

  return (payload as ApiResponse<T>).data;
}

export async function fetchMenuData(): Promise<MenuData> {
  const data = await parseApiResponse<MenuApiResponse>(await fetch(`${API_BASE_URL}/api/menu`, { cache: "no-store" }));

  return {
    categories: ["Semua", ...data.categories.map((category) => category.name)],
    products: data.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: product.price,
      description: product.description,
      image: product.imageUrl,
      featured: product.isFeatured,
    })),
  };
}

export async function createOrder(payload: {
  tableCode: string;
  customerName: string;
  paymentMethod: "CASH" | "QRIS";
  orderNote?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    note?: string;
  }>;
}) {
  return parseApiResponse<{ total: number; orderNumber: string; midtrans?: { token: string; redirectUrl: string; snapJsUrl: string } }>(
    await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    }),
  );
}
