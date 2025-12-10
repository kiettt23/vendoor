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
} from "./format";

// ID generation utilities
export { generateOrderNumber, generateId, generateRandomString } from "./id";

// Logger utilities
export {
  createLogger,
  logger,
  PerformanceTimer,
  measurePerformance,
} from "./logger";

// Result types (Unified error handling)
export {
  ok,
  okVoid,
  err,
  tryCatch,
  isOk,
  isErr,
  type Result,
  type AsyncResult,
  type VoidResult,
  type AsyncVoidResult,
} from "./result";

// Slug utilities
export {
  generateTimestampSlug,
  generateRandomSlug,
  generateUniqueSlug,
} from "./slug";
