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

// Badge Config (centralized)
export {
  ORDER_STATUS_BADGE,
  VENDOR_STATUS_BADGE,
  PRODUCT_STATUS_BADGE,
  STOCK_STATUS_BADGE,
  DISCOUNT_BADGE,
  getProductStatusBadge,
  getStockStatusBadge,
  getDiscountBadge,
  getBadgeConfig,
  type BadgeConfig,
} from "./badge-config";

// Auth & Account
export { AUTH, ACCOUNT } from "./auth";

// Cache
export { CACHE_DURATION, REVALIDATE_TAGS } from "./cache";

// React Query Keys
export { queryKeys, type QueryKeys } from "./query-keys";

// External services
export { RATE_LIMIT, EXTERNAL_URLS, APP_URL } from "./external";

// Formats & Patterns
export { REGEX_PATTERNS, DATE_FORMATS } from "./formats";

// Currency
export { CURRENCY } from "./currency";

// Route constants
export { ROUTES, REVALIDATION_PATHS } from "./routes";

// Navigation
export {
  VENDOR_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  HEADER_NAV_ITEMS,
  HEADER_CATEGORIES,
  HEADER_ICON_BUTTONS,
  FOOTER_LINKS,
  DASHBOARD_CONFIG,
  type NavItem,
  type LinkItem,
  type FooterLinkSection,
  type HeaderIconButton,
  type DashboardType,
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
