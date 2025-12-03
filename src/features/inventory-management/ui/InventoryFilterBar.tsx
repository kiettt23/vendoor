"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Package, AlertTriangle, CheckCircle } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

import type { InventoryStats, StockStatus } from "../model/types";

type FilterValue = "all" | StockStatus;

interface InventoryFilterBarProps {
  stats: InventoryStats;
}

export function InventoryFilterBar({ stats }: InventoryFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = (searchParams.get("filter") as FilterValue) || "all";
  const currentSearch = searchParams.get("search") || "";

  const handleFilterChange = (filter: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const filters: {
    value: FilterValue;
    label: string;
    count: number;
    icon: typeof Package;
  }[] = [
    {
      value: "all",
      label: "Tất cả",
      count: stats.totalVariants,
      icon: Package,
    },
    {
      value: "in_stock",
      label: "Còn hàng",
      count: stats.inStock,
      icon: CheckCircle,
    },
    {
      value: "low_stock",
      label: "Sắp hết",
      count: stats.lowStock,
      icon: AlertTriangle,
    },
    {
      value: "out_of_stock",
      label: "Hết hàng",
      count: stats.outOfStock,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = currentFilter === filter.value;
          return (
            <Button
              key={filter.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(filter.value)}
              className={cn(
                "gap-1.5",
                filter.value === "out_of_stock" &&
                  !isActive &&
                  "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700",
                filter.value === "low_stock" &&
                  !isActive &&
                  "border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
              )}
            >
              <filter.icon className="size-3.5" />
              {filter.label}
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.5 text-xs",
                  isActive ? "bg-primary-foreground/20" : "bg-muted"
                )}
              >
                {filter.count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm sản phẩm..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const value = e.target.value;
            // Debounce search
            const timeoutId = setTimeout(() => handleSearchChange(value), 300);
            return () => clearTimeout(timeoutId);
          }}
          className="pl-9"
        />
      </div>
    </div>
  );
}
