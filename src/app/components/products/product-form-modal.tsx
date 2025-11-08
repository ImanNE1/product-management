"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { Product } from "@/lib/types";

type ProductPayload = {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string | null;
  sku: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Product; 
  onSubmit: (payload: ProductPayload) => Promise<void> | void;
  loading?: boolean;
};

type Errors = Partial<Record<keyof ProductPayload, string>>;

function validate(form: Record<string, string>): Errors {
  const e: Errors = {};
  if (!form.name?.trim()) e.name = "Product name is required";
  else if (form.name.trim().length < 3) e.name = "Product name must be at least 3 characters";

  if (!form.category?.trim()) e.category = "Category is required";

  if (!form.sku?.trim()) e.sku = "SKU is required";
  else if (!/^[A-Z0-9-]+$/.test(form.sku)) e.sku = "SKU must be uppercase, numbers, hyphens only";

  const price = Number(form.price);
  if (isNaN(price) || price <= 0) e.price = "Valid price is required";

  const stock = Number(form.stock);
  if (!Number.isInteger(stock) || stock < 0) e.stock = "Valid stock is required";

  return e;
}

export function ProductFormModal({ open, onOpenChange, initial, onSubmit, loading }: Props) {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    sku: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? "",
        category: initial.category ?? "",
        price: String(initial.price ?? ""),
        stock: String(initial.stock ?? ""),
        description: initial.description ?? "",
        sku: initial.sku ?? "",
      });
      setErrors({});
    } else {
      setForm({ name: "", category: "", price: "", stock: "", description: "", sku: "" });
      setErrors({});
    }
  }, [initial, open]);

  const title = useMemo(() => (isEdit ? "Edit Product" : "Add New Product"), [isEdit]);
  const description = useMemo(
    () => (isEdit ? "Update product details below." : "Fill the form to add a new product."),
    [isEdit]
  );

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) {
      setErrors((prev) => {
        const cp = { ...prev };
        delete cp[key as keyof Errors];
        return cp;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    const payload: ProductPayload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description?.trim() || "",
      sku: form.sku.trim().toUpperCase(),
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
              className={errors.name ? "border-destructive" : ""}
              placeholder="e.g., Wireless Headphones"
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Category + SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                disabled={loading}
                className={errors.category ? "border-destructive" : ""}
                placeholder="e.g., Electronics"
              />
              {errors.category && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.category}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => handleChange("sku", e.target.value.toUpperCase())}
                disabled={loading}
                className={errors.sku ? "border-destructive" : ""}
                placeholder="e.g., ELEC-WBH-001"
              />
              {errors.sku && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.sku}
                </p>
              )}
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (IDR) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={1000}
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                disabled={loading}
                className={errors.price ? "border-destructive" : ""}
                placeholder="0"
              />
              {errors.price && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.price}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                disabled={loading}
                className={errors.stock ? "border-destructive" : ""}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
              placeholder="Enter product description"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" disabled={loading} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" /> {isEdit ? "Save Changes" : "Add Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}