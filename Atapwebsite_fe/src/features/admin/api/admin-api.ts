import type { AdminMenuCategory, AdminMenuItem, AdminOrder, AdminStats } from "@/features/admin/types/admin";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const ADMIN_TOKEN_KEY = "atap-admin-token";

type ApiResponse<T> = {
  data: T;
};

type AdminLoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    role: "OWNER" | "STAFF";
  };
};

type ApiOrder = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerContact: string | null;
  orderType: "DINE_IN" | "TAKE_AWAY";
  status: AdminOrder["rawStatus"];
  paymentStatus: AdminOrder["rawPaymentStatus"];
  total: number;
  createdAt: string;
  table: {
    code: string;
  } | null;
  orderNote: string | null;
  items: Array<{
    name: string;
    quantity: number;
    note: string | null;
  }>;
  payment: {
    method: "QRIS" | "CASH";
  } | null;
};

type PaginatedApiResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    take: number;
    total: number;
    totalPages: number;
  };
};

export type AdminOrdersResult = {
  orders: AdminOrder[];
  pagination: PaginatedApiResponse<ApiOrder>["pagination"];
};

type AdminMenuResponse = {
  categories: AdminMenuCategory[];
  items: AdminMenuItem[];
};

type UploadImageResponse = {
  imageUrl: string;
};

export type MenuItemPayload = {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

function getToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function isAdminAuthenticated() {
  return Boolean(getToken());
}

export function logoutAdmin() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function parseApiResponse<T>(response: Response) {
  const payload = (await response.json()) as ApiResponse<T> | { error?: string };

  if (!response.ok) {
    throw new Error("error" in payload && payload.error ? payload.error : "Request failed.");
  }

  return (payload as ApiResponse<T>).data;
}

async function adminFetch<T>(path: string, init?: RequestInit) {
  const headers: HeadersInit = {
    authorization: `Bearer ${getToken()}`,
    ...init?.headers,
  };

  if (init?.body) {
    headers["content-type" as keyof HeadersInit] = "application/json";
  }

  return parseApiResponse<T>(
    await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers,
    }),
  );
}

function mapStatus(status: ApiOrder["status"], paymentStatus: ApiOrder["paymentStatus"]): AdminOrder["status"] {
  if (status === "CANCELLED") {
    return "Batal";
  }

  if (status === "COMPLETED") {
    return "Selesai";
  }

  if (paymentStatus === "UNPAID" || paymentStatus === "FAILED") {
    return "Belum bayar";
  }

  return "Di Proses";
}

function mapOrder(order: ApiOrder): AdminOrder {
  const createdAt = new Date(order.createdAt);

  return {
    id: order.orderNumber,
    orderId: order.id,
    rawStatus: order.status,
    rawPaymentStatus: order.paymentStatus,
    customerName: order.customerName || "Customer Atap",
    contact: order.customerContact || "-",
    table: order.table?.code || "-",
    orderType: order.orderType === "DINE_IN" ? "Dine In" : "Take Away",
    items: order.items.map((item) => `${item.name} x${item.quantity}${item.note ? ` (${item.note})` : ""}`),
    orderNote: order.orderNote,
    total: order.total,
    method: order.payment?.method === "CASH" ? "Tunai" : "QRIS",
    time: createdAt.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: mapStatus(order.status, order.paymentStatus),
  };
}

export async function loginAdmin(username: string, password: string) {
  const data = await parseApiResponse<AdminLoginResponse>(
    await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }),
  );

  window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

  return data.user;
}

export async function refreshAdminSession() {
  const data = await adminFetch<AdminLoginResponse>("/api/admin/auth/refresh", {
    method: "POST",
  });

  window.localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

  return data.user;
}

export async function fetchAdminOrders(filters?: { search?: string; dateFrom?: string; dateTo?: string; page?: number; take?: number }) {
  const params = new URLSearchParams();

  if (filters?.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters?.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }

  if (filters?.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  if (filters?.page) {
    params.set("page", String(filters.page));
  }

  if (filters?.take) {
    params.set("take", String(filters.take));
  }

  const data = await adminFetch<PaginatedApiResponse<ApiOrder>>(`/api/admin/orders${params.size ? `?${params.toString()}` : ""}`);

  return {
    orders: data.items.map(mapOrder),
    pagination: data.pagination,
  };
}

export async function updateOrderStatus(
  orderId: string,
  payload: Partial<Pick<ApiOrder, "status" | "paymentStatus">>,
) {
  const data = await adminFetch<ApiOrder>(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return mapOrder(data);
}

export async function deleteAdminOrder(orderId: string) {
  const data = await adminFetch<ApiOrder>(`/api/admin/orders/${orderId}`, {
    method: "DELETE",
  });

  return mapOrder(data);
}

export async function fetchAdminStats() {
  return adminFetch<AdminStats>("/api/admin/stats");
}

export async function fetchAdminMenu() {
  return adminFetch<AdminMenuResponse>("/api/admin/menu");
}

export async function uploadAdminMenuImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  return parseApiResponse<UploadImageResponse>(
    await fetch(`${API_BASE_URL}/api/admin/menu/image`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    }),
  );
}

export async function createAdminMenuItem(payload: MenuItemPayload) {
  return adminFetch<AdminMenuItem>("/api/admin/menu", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminMenuItem(id: string, payload: Partial<MenuItemPayload>) {
  return adminFetch<AdminMenuItem>(`/api/admin/menu/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminMenuItem(id: string) {
  return adminFetch<AdminMenuItem>(`/api/admin/menu/${id}`, {
    method: "DELETE",
  });
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  return adminFetch("/api/admin/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
