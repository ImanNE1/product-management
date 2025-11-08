export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  sku: string;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type StockFilter = "all" | "in-stock" | "low-stock" | "out-of-stock";
export type SortField = "name" | "category" | "price" | "stock" | "created_at";
export type SortDirection = "asc" | "desc";

export type PaginationMeta = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  categories?: string[];
};
