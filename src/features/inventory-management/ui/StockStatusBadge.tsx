"use client";

import { cn } from "@/shared/lib/utils";

import {
  type StockStatus,
  STOCK_STATUS_CONFIG,
  getStockStatus,
} from "../model/types";

interface StockStatusBadgeProps {
  stock: number;
  className?: string;
}

export function StockStatusBadge({ stock, className }: StockStatusBadgeProps) {
  const status: StockStatus = getStockStatus(stock);
  const config = STOCK_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.bgColor,
        config.color,
        className
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "in_stock" && "bg-green-500",
          status === "low_stock" && "bg-yellow-500",
          status === "out_of_stock" && "bg-red-500"
        )}
      />
      {config.label}
    </span>
  );
}
