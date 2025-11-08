// src/app/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navbar } from "./components/navbar";
import { ProductsAPI } from "@/lib/api";
import { Product, SortDirection, SortField, StockFilter } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, Package } from "lucide-react";
import { ProductTable } from "./components/products/product-table";
import { ProductCard } from "./components/products/product-card";
import { ProductFormModal } from "./components/products/product-form-modal";
import { DeleteConfirmDialog } from "./components/products/delete-confirm-dialog";
import { FilterPanel } from "./components/products/filter-panel";
import { PaginationBar } from "./components/pagination-bar";

export default function Page() {
  // Filters & sorting
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modals
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Reset page 1 
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategories, stockFilter, sortField, sortDirection]);

  const qc = useQueryClient();

  // Fetch products dengan pagination
  const { data: productsRes, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "products",
      { search, selectedCategories, stockFilter, sortField, sortDirection, page, perPage },
    ],
    queryFn: () =>
      ProductsAPI.list({
        search,
        categories: selectedCategories,
        stock_filter: stockFilter,
        sort_field: sortField,
        sort_direction: sortDirection,
        page,
        per_page: perPage,
      }),
    staleTime: 30_000,
  });

  // Categories
  const categories = useMemo<string[]>(() => {
    return (productsRes?.meta?.categories as string[]) || [];
  }, [productsRes]);

  // Stats
  const { data: statsRes } = useQuery({
    queryKey: ["stats"],
    queryFn: () => ProductsAPI.stats(),
    staleTime: 60_000,
  });

  // Mutations
  const createMut = useMutation({
    mutationFn: ProductsAPI.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      setShowForm(false);
    },
  });

  const updateMut = useMutation({
    mutationFn: (payload: { id: number; data: any }) =>
      ProductsAPI.update(payload.id, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      setShowForm(false);
      setEditing(null);
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => ProductsAPI.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
      setDeleteTarget(null);
    },
  });

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || stockFilter !== "all" || search.trim() !== "";

  const totalValue = statsRes?.data?.total_value ?? 0;

  return (
    <>
      <Navbar onAdd={handleOpenAdd} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl">Product Inventory</CardTitle>
                  <CardDescription className="mt-1">
                    Manage your product catalog with ease
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters((s) => !s)}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {hasActiveFilters && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {selectedCategories.length + (stockFilter !== "all" ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <FilterPanel
                open={showFilters}
                categories={categories}
                selectedCategories={selectedCategories}
                onToggleCategory={(c) =>
                  setSelectedCategories((prev) =>
                    prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                  )
                }
                stockFilter={stockFilter}
                onStockFilterChange={setStockFilter}
                onClearAll={() => {
                  setSelectedCategories([]);
                  setStockFilter("all");
                  setSearch("");
                }}
                resultCount={productsRes?.data?.length ?? 0}
                totalCount={productsRes?.meta?.total ?? 0}
              />
            </div>
          </CardHeader>

          <CardContent>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <ProductTable
                products={productsRes?.data ?? []}
                isLoading={isLoading}
                isError={isError}
                onRetry={refetch}
                onEdit={handleOpenEdit}
                onDelete={(p) => setDeleteTarget(p)}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">Loading...</div>
              ) : isError ? (
                <div className="text-sm text-destructive">Failed to load products.</div>
              ) : (productsRes?.data?.length ?? 0) > 0 ? (
                productsRes!.data.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onEdit={() => handleOpenEdit(p)}
                    onDelete={() => setDeleteTarget(p)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground py-12">
                  <Package className="h-12 w-12 opacity-20" />
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {productsRes?.meta && productsRes.meta.last_page > 1 && (
              <div className="mt-6">
                <PaginationBar
                  meta={productsRes.meta}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}

            {/* Statistics */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {productsRes?.meta?.total ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{categories.length}</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {statsRes?.data?.total_stock ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Stock</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(totalValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Form Modal */}
      <ProductFormModal
        open={showForm}
        onOpenChange={(o) => {
          setShowForm(o);
          if (!o) setEditing(null);
        }}
        initial={editing ?? undefined}
        onSubmit={async (payload) => {
          if (editing) {
            await updateMut.mutateAsync({ id: editing.id, data: payload });
          } else {
            await createMut.mutateAsync(payload as any);
          }
        }}
        loading={createMut.isPending || updateMut.isPending}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        product={deleteTarget ?? undefined}
        onConfirm={async () => {
          if (deleteTarget) await deleteMut.mutateAsync(deleteTarget.id);
        }}
        loading={deleteMut.isPending}
      />
    </>
  );
}
