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
      <div className="flex items-center gap-2">
        {/* Filter Sheet - Mobile & Desktop */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative h-9">
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
          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] flex flex-col p-0 gap-0"
          >
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <Filter className="h-5 w-5" />
                Bộ lọc sản phẩm
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Price Range */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Khoảng giá</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Thấp nhất
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          value={filterParams.minPrice || ""}
                          onChange={(e) =>
                            handlePriceChange("minPrice", e.target.value)
                          }
                          className="h-10 pr-8"
                          min={0}
                        />
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                          ₫
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        Cao nhất
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="∞"
                          value={filterParams.maxPrice || ""}
                          onChange={(e) =>
                            handlePriceChange("maxPrice", e.target.value)
                          }
                          className="h-10 pr-8"
                          min={0}
                        />
                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Đánh giá</Label>
                  <Select
                    value={filterParams.minRating?.toString() || "all"}
                    onValueChange={handleRatingChange}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Tất cả đánh giá" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả đánh giá</SelectItem>
                      {RATING_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          <span className="flex items-center gap-2">
                            {option.label}
                            <span className="text-yellow-500">
                              {"★".repeat(option.value)}
                              <span className="text-muted-foreground/30">
                                {"★".repeat(5 - option.value)}
                              </span>
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vendor Filter */}
                {showVendorFilter && vendors.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Cửa hàng</Label>
                    <Select
                      value={filterParams.vendorId || "all"}
                      onValueChange={handleVendorChange}
                    >
                      <SelectTrigger className="h-10">
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
                <div className="flex items-center space-x-3 p-4 rounded-lg border bg-muted/30">
                  <Checkbox
                    id="inStock"
                    checked={filterParams.inStock || false}
                    onCheckedChange={handleStockChange}
                    className="h-5 w-5"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="inStock"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Chỉ hiện còn hàng
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Ẩn các sản phẩm đã hết hàng
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t mt-auto bg-background">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  disabled={!hasFilters}
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
                <SheetTrigger asChild>
                  <Button className="w-full">Xem kết quả</Button>
                </SheetTrigger>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Sort dropdown - always visible */}
        <Select
          value={filterParams.sort || "newest"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-40 h-9">
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

        {/* Clear Filters Badge Button */}
        {hasFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClearFilters}
            className="h-9 px-3 text-xs font-medium hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
