"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, XCircle } from "lucide-react";
import { StockFilter } from "@/lib/types";

type Props = {
  open: boolean;
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  stockFilter: StockFilter;
  onStockFilterChange: (value: StockFilter) => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount: number;
};

export function FilterPanel({
  open,
  categories,
  selectedCategories,
  onToggleCategory,
  stockFilter,
  onStockFilterChange,
  onClearAll,
  resultCount,
  totalCount,
}: Props) {
  const hasActive = selectedCategories.length > 0 || stockFilter !== "all";

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="filters"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="rounded-lg border bg-muted/50 p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Filter Products</h3>
              {hasActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="h-8 gap-2 text-xs"
                >
                  <XCircle className="h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Category</Label>
              {categories.length === 0 ? (
                <p className="text-xs text-muted-foreground">No categories available.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const active = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => onToggleCategory(category)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground hover:bg-secondary"
                        }`}
                        aria-pressed={active}
                        aria-label={`Filter category ${category}`}
                        type="button"
                      >
                        {category}
                        {active && <X className="ml-1 h-3 w-3" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Stock Filter */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Stock Level</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onStockFilterChange("all")}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    stockFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                  aria-pressed={stockFilter === "all"}
                >
                  All Stock
                </button>
                <button
                  type="button"
                  onClick={() => onStockFilterChange("in-stock")}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    stockFilter === "in-stock"
                      ? "bg-green-600 text-white"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                  aria-pressed={stockFilter === "in-stock"}
                >
                  In Stock (20+)
                </button>
                <button
                  type="button"
                  onClick={() => onStockFilterChange("low-stock")}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    stockFilter === "low-stock"
                      ? "bg-yellow-600 text-white"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                  aria-pressed={stockFilter === "low-stock"}
                >
                  Low Stock (1-20)
                </button>
                <button
                  type="button"
                  onClick={() => onStockFilterChange("out-of-stock")}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    stockFilter === "out-of-stock"
                      ? "bg-red-600 text-white"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                  aria-pressed={stockFilter === "out-of-stock"}
                >
                  Out of Stock
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Showing {resultCount} of {totalCount} products
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
