"use client";

import { useState } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { VendorProductCard } from "./VendorProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";

// ============================================
// TYPES
// ============================================

interface VendorProductListItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  category: {
    name: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  totalStock: number;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface VendorProductListProps {
  products: VendorProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentStatus: "all" | "active" | "inactive";
  currentSearch?: string;
}

// ============================================
// VENDOR PRODUCT LIST
// ============================================

export function VendorProductList({
  products,
  pagination,
  currentStatus,
  currentSearch,
}: VendorProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(currentSearch ?? "");

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to page 1
    router.push(`/vendor/products?${params.toString()}`);
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset to page 1
    router.push(`/vendor/products?${params.toString()}`);
  };

  // Build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/vendor/products?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="inactive">Đã ẩn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Tìm thấy{" "}
        <span className="font-medium text-foreground">{pagination.total}</span>{" "}
        sản phẩm
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            {currentSearch || currentStatus !== "all"
              ? "Không tìm thấy sản phẩm nào"
              : "Bạn chưa có sản phẩm nào"}
          </p>
          {!currentSearch && currentStatus === "all" && (
            <Button
              variant="link"
              onClick={() => router.push("/vendor/products/new")}
              className="mt-2"
            >
              Thêm sản phẩm đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <VendorProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              {pagination.page > 1 ? (
                <PaginationPrevious href={buildPageUrl(pagination.page - 1)} />
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed">
                  Trước
                </span>
              )}
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => {
                // Show first page, last page, current page, and pages around current page
                const isFirstPage = page === 1;
                const isLastPage = page === pagination.totalPages;
                const isCurrentPage = page === pagination.page;
                const isNearCurrentPage = Math.abs(page - pagination.page) <= 1;

                if (
                  isFirstPage ||
                  isLastPage ||
                  isCurrentPage ||
                  isNearCurrentPage
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={buildPageUrl(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                // Show ellipsis
                if (page === 2 || page === pagination.totalPages - 1) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              }
            )}

            {/* Next */}
            <PaginationItem>
              {pagination.page < pagination.totalPages ? (
                <PaginationNext href={buildPageUrl(pagination.page + 1)} />
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed">
                  Sau
                </span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
