/**
 * Constants Module - Barrel Export
 *
 * Centralized exports for app constants.
 * Usage: import { PAGINATION, ROUTES } from "@/lib/constants"
 */

// App constants
export {
  PAGINATION,
  FILE_UPLOAD,
  IMAGE_DIMENSIONS,
  PRICE_LIMITS,
  STOCK_LIMITS,
  ORDER,
  ACCOUNT,
  AUTH,
  RATE_LIMIT,
  CACHE_DURATION,
  REVALIDATE_TAGS,
  EXTERNAL_URLS,
  REGEX_PATTERNS,
  DATE_FORMATS,
  CURRENCY,
  STATUS,
  FEATURE_FLAGS,
} from "./app";

// Route constants
export { ROUTES, PROTECTED_ROUTES, ROLE_ROUTES } from "./routes";
