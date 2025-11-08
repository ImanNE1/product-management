"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { formatIDR } from "@/lib/utils";

// Helper pewarnaan pill stok
function stockPillClass(stock: number) {
  if (stock > 20) return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  if (stock > 0) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
}

type Props = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const desc = product.description ?? "";
  const shortDesc = desc.length > 90 ? `${desc.slice(0, 90)}...` : desc;

  return (
    <Card>
      <CardContent className="p-4">
        {/* Header: nama + aksi */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>
          <div className="flex-shrink-0 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="hover:bg-primary/10"
              aria-label={`Edit ${product.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* kategori + stok */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{product.category}</Badge>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${stockPillClass(
              product.stock
            )}`}
          >
            {product.stock} units
          </span>
        </div>

        {/* Deskripsi + harga */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{shortDesc}</p>
          <p className="font-semibold text-foreground whitespace-nowrap">
            {formatIDR(product.price)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}