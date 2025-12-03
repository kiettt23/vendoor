/**
 * ProductFilterBar Component
 *
 * Filter bar với Sort, Price, Rating, Stock options
 * Mobile: Collapsible drawer
 * Desktop: Horizontal bar
 */

"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";

import { SORT_OPTIONS, RATING_OPTIONS } from "../model/types";
import {
  parseFilterParams,
  updateFilterParam,
  clearFilters,
  hasActiveFilters,
} from "../lib/filter-utils";

interface ProductFilterBarProps {
  /** Tổng số sản phẩm (sau khi filter) */
  totalProducts: number;
  /** Show vendor filter */
  showVendorFilter?: boolean;
  /** Available vendors for filter */
  vendors?: { id: string; name: string }[];
}

export function ProductFilterBar({
  totalProducts,
  showVendorFilter = false,
  vendors = [],
}: ProductFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParams = useMemo(
    () => parseFilterParams(searchParams),
    [searchParams]
  );
  const hasFilters = hasActiveFilters(filterParams);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterParams.category) count++;
    if (filterParams.minPrice || filterParams.maxPrice) count++;
    if (filterParams.minRating) count++;
    if (filterParams.vendorId) count++;
    if (filterParams.inStock) count++;
    return count;
  }, [filterParams]);

  // Update URL helper
  const updateUrl = useCallback(
    (key: string, value: string | number | boolean | undefined) => {
      const newParams = updateFilterParam(searchParams, key, value);
      router.push(`/products?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    const newParams = clearFilters(searchParams);
    router.push(`/products?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Sort change handler
  const handleSortChange = (value: string) => {
    updateUrl("sort", value === "newest" ? undefined : value);
  };

  // Price filter handlers
  const handlePriceChange = (type: "minPrice" | "maxPrice", value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    updateUrl(type, numValue);
  };

  // Rating filter handler
  const handleRatingChange = (value: string) => {
    updateUrl("minRating", value === "all" ? undefined : parseInt(value, 10));
  };

  // Stock filter handler
  const handleStockChange = (checked: boolean) => {
    updateUrl("inStock", checked || undefined);
  };

  // Vendor filter handler
  const handleVendorChange = (value: string) => {
    updateUrl("vendor", value === "all" ? undefined : value);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {totalProducts} sản phẩm
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="ml-2 h-auto p-1 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Sort dropdown - always visible */}
        <Select
          value={filterParams.sort || "newest"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Sheet - Mobile & Desktop */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Bộ lọc sản phẩm
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Khoảng giá</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={filterParams.minPrice || ""}
                    onChange={(e) =>
                      handlePriceChange("minPrice", e.target.value)
                    }
                    className="h-9"
                    min={0}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={filterParams.maxPrice || ""}
                    onChange={(e) =>
                      handlePriceChange("maxPrice", e.target.value)
                    }
                    className="h-9"
                    min={0}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Đánh giá</Label>
                <Select
                  value={filterParams.minRating?.toString() || "all"}
                  onValueChange={handleRatingChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả đánh giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả đánh giá</SelectItem>
                    {RATING_OPTIONS.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value.toString()}
                      >
                        {option.label} ⭐
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor Filter */}
              {showVendorFilter && vendors.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Cửa hàng</Label>
                  <Select
                    value={filterParams.vendorId || "all"}
                    onValueChange={handleVendorChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả cửa hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả cửa hàng</SelectItem>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* In Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filterParams.inStock || false}
                  onCheckedChange={handleStockChange}
                />
                <Label htmlFor="inStock" className="text-sm cursor-pointer">
                  Chỉ hiện còn hàng
                </Label>
              </div>

              {/* Clear Filters Button */}
              {hasFilters && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
