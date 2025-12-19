import type { StockStatus } from "../model/types";
import { STOCK_THRESHOLDS } from "../model/constants";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= STOCK_THRESHOLDS.OUT_OF_STOCK) return "out_of_stock";
  if (stock <= STOCK_THRESHOLDS.LOW_STOCK) return "low_stock";
  return "in_stock";
}
