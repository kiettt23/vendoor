"use client";

import { X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";

import { RATING_OPTIONS, SORT_OPTIONS } from "../model";
import {
  clearFilters,
  hasActiveFilters,
  parseFilterParams,
  updateFilterParam,
} from "../lib";

type Vendor = {
  id: string;
  name: string;
};

type ActiveFilterTagsProps = {
  vendors?: Vendor[];
};

export function ActiveFilterTags({ vendors = [] }: ActiveFilterTagsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = parseFilterParams(searchParams);

  const vendorMap = new Map(vendors.map((v) => [v.id, v.name]));

  const handleRemoveFilter = (key: string, value?: string) => {
    const newParams = updateFilterParam(searchParams, key, value ?? "");
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    const newParams = clearFilters(searchParams);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  if (!hasActiveFilters(filters)) {
    return null;
  }

  const tags: { key: string; label: string; value?: string }[] = [];

  // Sort tag
  if (filters.sort && filters.sort !== "newest") {
    const sortLabel =
      SORT_OPTIONS.find((s) => s.value === filters.sort)?.label ?? filters.sort;
    tags.push({ key: "sort", label: `Sắp xếp: ${sortLabel}` });
  }

  // Price range tags
  if (filters.minPrice !== undefined) {
    tags.push({
      key: "minPrice",
      label: `Từ ${filters.minPrice.toLocaleString("vi-VN")}₫`,
    });
  }
  if (filters.maxPrice !== undefined) {
    tags.push({
      key: "maxPrice",
      label: `Đến ${filters.maxPrice.toLocaleString("vi-VN")}₫`,
    });
  }

  // Rating tag
  if (filters.minRating !== undefined) {
    const ratingLabel =
      RATING_OPTIONS.find((r) => r.value === filters.minRating)?.label ??
      `${filters.minRating}★`;
    tags.push({ key: "minRating", label: ratingLabel });
  }

  // In stock tag
  if (filters.inStock) {
    tags.push({ key: "inStock", label: "Còn hàng" });
  }

  // Vendor tag
  if (filters.vendorId) {
    const vendorName = vendorMap.get(filters.vendorId) ?? "Cửa hàng";
    tags.push({ key: "vendorId", label: vendorName });
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Bộ lọc:</span>
      {tags.map((tag) => (
        <Badge key={tag.key} variant="secondary" className="gap-1 pr-1">
          {tag.label}
          <button
            type="button"
            onClick={() => handleRemoveFilter(tag.key, tag.value)}
            className="hover:bg-muted ml-1 rounded-full p-0.5"
            aria-label={`Xóa bộ lọc ${tag.label}`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
      {tags.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-muted-foreground h-auto px-2 py-1 text-xs"
        >
          Xóa tất cả
        </Button>
      )}
    </div>
  );
}
