/**
 * Constants Module - Barrel Export
 *
 * Centralized exports for app constants.
 * Usage: import { PAGINATION, ROUTES } from "@/lib/constants"
 */

// Pagination
export { PAGINATION } from "./pagination";

// Upload & Images
export { FILE_UPLOAD, IMAGE_DIMENSIONS, CLOUDINARY_PRESETS } from "./upload";

// Product
export { PRICE_LIMITS, STOCK_LIMITS } from "./product";

// Order & Status
export {
  ORDER,
  STATUS,
  VENDOR,
  ORDER_STATUS_CONFIG,
  VENDOR_STATUS_CONFIG,
  getStatusConfig,
  type StatusConfig,
} from "./order";

// Auth & Account
export { AUTH, ACCOUNT } from "./auth";

// Cache
export { CACHE_DURATION, REVALIDATE_TAGS } from "./cache";

// External services
export { RATE_LIMIT, EXTERNAL_URLS } from "./external";

// Formats & Patterns
export { REGEX_PATTERNS, DATE_FORMATS } from "./formats";

// Currency
export { CURRENCY } from "./currency";

// Feature flags
export { FEATURE_FLAGS } from "./features";

// Route constants
export { ROUTES, PROTECTED_ROUTES, ROLE_ROUTES } from "./routes";

// Navigation
export {
  VENDOR_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  HEADER_NAV_ITEMS,
  HEADER_CATEGORIES,
  HEADER_ICON_BUTTONS,
  FOOTER_LINKS,
  type NavItem,
  type LinkItem,
  type FooterLinkSection,
  type HeaderIconButton,
} from "./navigation";

// Toast messages
export {
  TOAST_MESSAGES,
  showToast,
  showErrorToast,
  showInfoToast,
  showCustomToast,
} from "./toast";

// Query & Display Limits
export { LIMITS } from "./limits";
