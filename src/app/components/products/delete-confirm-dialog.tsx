"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export function DeleteConfirmDialog({ open, onOpenChange, product, onConfirm, loading }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Are you sure?</p>
            <p className="text-muted-foreground mt-1">
              This will permanently delete <span className="font-medium text-foreground">{product?.name}</span> (SKU: {product?.sku}).
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" disabled={loading} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="flex-1 gap-2" disabled={loading} onClick={onConfirm}>
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}