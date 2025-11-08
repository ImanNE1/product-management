import { Product, SortDirection, SortField, StockFilter, PaginationMeta } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function isFormDataBody(body: any) {
  return typeof body !== "undefined" && body !== null && typeof (body as any).append === "function";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit | undefined = isFormDataBody(init?.body) ? undefined : { "Content-Type": "application/json" };
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type ListParams = {
  search?: string;
  categories?: string[];
  stock_filter?: StockFilter;
  sort_field?: SortField;
  sort_direction?: SortDirection;
  page?: number;
  per_page?: number;
};

export type CreatePayload = {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string | null;
  sku: string;
  image?: File | null;
};

export type UpdatePayload = CreatePayload & { remove_image?: boolean };

export const ProductsAPI = {
  list: (params: ListParams = {}) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (params.stock_filter && params.stock_filter !== "all") usp.set("stock_filter", params.stock_filter);
    if (params.sort_field) usp.set("sort_field", params.sort_field);
    if (params.sort_direction) usp.set("sort_direction", params.sort_direction);
    if (params.page) usp.set("page", String(params.page));
    usp.set("per_page", String(params.per_page ?? 10));
    if (params.categories?.length) params.categories.forEach((c) => usp.append("categories[]", c));
    return request<{ success: boolean; data: Product[]; meta: PaginationMeta }>(`/products?${usp.toString()}`);
  },

  create: (payload: CreatePayload) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("category", payload.category);
    fd.append("price", String(payload.price));
    fd.append("stock", String(payload.stock));
    fd.append("sku", payload.sku);
    if (payload.description) fd.append("description", payload.description);
    if (payload.image) fd.append("image", payload.image);
    return request<{ success: boolean; data: Product; message: string }>(`/products`, {
      method: "POST",
      body: fd,
    });
  },

  update: (id: number, payload: UpdatePayload) => {
    const fd = new FormData();
    fd.append("_method", "PUT");
    fd.append("name", payload.name);
    fd.append("category", payload.category);
    fd.append("price", String(payload.price));
    fd.append("stock", String(payload.stock));
    fd.append("sku", payload.sku);
    if (payload.description) fd.append("description", payload.description);
    if (payload.image) fd.append("image", payload.image);
    if (payload.remove_image) fd.append("remove_image", "1");
    return request<{ success: boolean; data: Product; message: string }>(`/products/${id}`, {
      method: "POST",
      body: fd,
    });
  },

  remove: (id: number) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: "DELETE",
    }),

  categories: () =>
    request<{ success: boolean; data: string[] }>(`/products-categories`),

  stats: () =>
    request<{ success: boolean; data: Record<string, number> }>(`/products-statistics`),
};
