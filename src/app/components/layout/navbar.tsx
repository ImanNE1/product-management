"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ThemeToggle } from "../theme/theme-toggle";

type NavbarProps = {
  onAdd: () => void;
};

export function Navbar({ onAdd }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Image
                src="/asset/img/logo2.png"
                alt="Product Management logo"
                width={35}
                height={35}
                className="object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-foreground">Product Management</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Add product */}
            <Button
              onClick={onAdd}
              size="sm"
              className="gap-2"
              aria-label="Add new product"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}