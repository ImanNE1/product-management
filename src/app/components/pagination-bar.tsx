"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PaginationMeta } from "@/lib/types";

type Props = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
};

function getPageItems(current: number, last: number): (number | string)[] {
  const delta = 1; // sibling count
  const range: number[] = [];
  for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i++) {
    range.push(i);
  }
  const withEdges = new Set<number>([1, last, ...range]);
  const pages = Array.from(withEdges).sort((a, b) => a - b);

  const result: (number | string)[] = [];
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    if (i === 0) {
      result.push(p);
      continue;
    }
    const prev = pages[i - 1];
    if (p - prev === 1) {
      result.push(p);
    } else {
      result.push("...");
      result.push(p);
    }
  }
  return result;
}

export function PaginationBar({ meta, onPageChange, className }: Props) {
  const { current_page, last_page, total, from, to } = meta;
  const disabledPrev = current_page <= 1;
  const disabledNext = current_page >= last_page;

  const items = getPageItems(current_page, last_page);

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className || ""}`}>
      <p className="text-xs text-muted-foreground">
        Showing {from ?? 0}-{to ?? 0} of {total} products
      </p>

      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={disabledPrev} aria-label="First page">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(current_page - 1)} disabled={disabledPrev} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {items.map((it, idx) =>
          typeof it === "string" ? (
            <span key={`dots-${idx}`} className="px-2 text-muted-foreground text-sm select-none">…</span>
          ) : (
            <Button
              key={it}
              variant={it === current_page ? "secondary" : "outline"}
              size="sm"
              onClick={() => onPageChange(it)}
              aria-current={it === current_page ? "page" : undefined}
            >
              {it}
            </Button>
          )
        )}

        <Button variant="outline" size="sm" onClick={() => onPageChange(current_page + 1)} disabled={disabledNext} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(last_page)} disabled={disabledNext} aria-label="Last page">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}