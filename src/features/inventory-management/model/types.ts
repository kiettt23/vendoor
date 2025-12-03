import { z } from "zod";

import { STOCK_LIMITS } from "@/shared/lib/constants";

/**
 * Stock status thresholds - imported from shared constants
 */
export const STOCK_THRESHOLDS = {
  LOW_STOCK: STOCK_LIMITS.LOW_STOCK_THRESHOLD,
  OUT_OF_STOCK: STOCK_LIMITS.MIN,
} as const;

/**
 * Stock status enum
 */
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * Get stock status based on quantity
 */
export function getStockStatus(stock: number): StockStatus {
  if (stock <= STOCK_THRESHOLDS.OUT_OF_STOCK) return "out_of_stock";
  if (stock <= STOCK_THRESHOLDS.LOW_STOCK) return "low_stock";
  return "in_stock";
}

/**
 * Stock status config for UI
 */
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

/**
 * Inventory item type (variant with product info)
 */
export interface InventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  variantName: string | null;
  sku: string | null;
  stock: number;
  status: StockStatus;
  price: number;
  image: string | null;
}

/**
 * Inventory stats
 */
export interface InventoryStats {
  totalProducts: number;
  totalVariants: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

/**
 * Schema for bulk stock update
 */
export const bulkUpdateStockSchema = z.object({
  updates: z
    .array(
      z.object({
        variantId: z.string().min(1),
        stock: z.number().int().min(0, "Số lượng không được âm"),
      })
    )
    .min(1, "Cần ít nhất 1 sản phẩm"),
});

export type BulkUpdateStockInput = z.infer<typeof bulkUpdateStockSchema>;

/**
 * Schema for single stock update
 */
export const updateStockSchema = z.object({
  variantId: z.string().min(1),
  stock: z.number().int().min(0, "Số lượng không được âm"),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
