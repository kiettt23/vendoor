/**
 * Utils Module - Barrel Export
 *
 * Centralized exports for utility functions.
 * Usage: import { cn, formatPrice, createLogger } from "@/lib/utils"
 */

// Class names utility
export { cn } from "./cn";

// Formatting utilities
export {
  formatPrice,
  formatPriceNumber,
  parsePrice,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPhone,
  formatFileSize,
  formatNumber,
  formatPercent,
  truncate,
  capitalize,
  slugify,
  formatOrderNumber,
  formatStockStatus,
  formatOrderStatus,
  formatVendorStatus,
} from "./format";

// Logger utilities
export {
  createLogger,
  logger,
  PerformanceTimer,
  measurePerformance,
} from "./logger";
