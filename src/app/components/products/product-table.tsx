"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Package,
  RefreshCw,
} from "lucide-react";
import { Product, SortDirection, SortField } from "@/lib/types";
import { formatIDR } from "@/lib/utils";

type Props = {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

// Tombol header untuk sorting dengan indikator
function SortButton({
  label,
  field,
  activeField,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  activeField: SortField;
  direction: SortDirection;
  onSort: (f: SortField) => void;
}) {
  const isActive = activeField === field;
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className="gap-2 hover:bg-muted"
      aria-pressed={isActive}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {isActive ? (
        direction === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-60" />
      )}
    </Button>
  );
}

// Warna status stok
function stockPillClass(stock: number) {
  if (stock > 20)
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  if (stock > 0)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
}

// Helper truncate aman
function truncate(text: string, max = 90) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export function ProductTable({
  products,
  isLoading,
  isError,
  onRetry,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}: Props) {
  // Loading state: skeleton
  if (isLoading) {
    return (
      <div className="w-full">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {["Product", "Category", "Price", "Stock", "Description", "Actions"].map(
                (h) => (
                  <th key={h} className="text-left py-3 px-4">
                    <Skeleton className="h-6 w-24" />
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-4 w-56" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-sm text-destructive mb-3">
            Failed to load products.
          </p>
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
        <Package className="h-12 w-12 opacity-20" />
        <p className="text-sm">No products found</p>
      </div>
    );
  }

  // Normal table
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th
              className="text-left py-3 px-4"
              aria-sort={
                sortField === "name"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                label="Product"
                field="name"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
            </th>
            <th
              className="text-left py-3 px-4"
              aria-sort={
                sortField === "category"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                label="Category"
                field="category"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
            </th>
            <th
              className="text-left py-3 px-4"
              aria-sort={
                sortField === "price"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                label="Price"
                field="price"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
            </th>
            <th
              className="text-left py-3 px-4"
              aria-sort={
                sortField === "stock"
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <SortButton
                label="Stock"
                field="stock"
                activeField={sortField}
                direction={sortDirection}
                onSort={onSort}
              />
            </th>
            {/* Kolom Deskripsi (non-sortable) */}
            <th className="text-left py-3 px-4">Description</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const fullDesc = p.description ?? "";
            const shortDesc = truncate(fullDesc, 90);
            return (
              <tr
                key={p.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      SKU: {p.sku}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="secondary">{p.category}</Badge>
                </td>
                <td className="py-4 px-4">
                  <p className="font-semibold text-foreground">
                    {formatIDR(p.price)}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stockPillClass(
                      p.stock
                    )}`}
                  >
                    {p.stock} units
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p
                    className="text-sm text-muted-foreground max-w-[28rem] truncate"
                    title={fullDesc}
                  >
                    {shortDesc || "-"}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(p)}
                      className="hover:bg-primary/10"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(p)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}