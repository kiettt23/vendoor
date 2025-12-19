import { STOCK_LIMITS } from "@/shared/lib/constants";
import type { StockStatus } from "./types";

export const STOCK_THRESHOLDS = {
  LOW_STOCK: STOCK_LIMITS.LOW_STOCK_THRESHOLD,
  OUT_OF_STOCK: STOCK_LIMITS.MIN,
} as const;

export const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  { label: string; color: string; bgColor: string }
> = {
  in_stock: {
    label: "Còn hàng",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  low_stock: {
    label: "Sắp hết",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  out_of_stock: {
    label: "Hết hàng",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};
