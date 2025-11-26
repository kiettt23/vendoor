/**
 * Application-wide Constants
 *
 * Centralized configuration values.
 * Usage: import { PAGINATION, FILE_UPLOAD } from "@/lib/constants"
 */

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  ADMIN_PAGE_SIZE: 20,
} as const;

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

/**
 * Image dimensions
 */
export const IMAGE_DIMENSIONS = {
  PRODUCT_THUMBNAIL: { width: 400, height: 400 },
  PRODUCT_DETAIL: { width: 800, height: 800 },
  PRODUCT_CARD: { width: 300, height: 300 },
  AVATAR: { width: 200, height: 200 },
} as const;

/**
 * Price limits (VND)
 */
export const PRICE_LIMITS = {
  MIN: 1000,
  MAX: 1000000000, // 1 billion VND
} as const;

/**
 * Stock limits
 */
export const STOCK_LIMITS = {
  MIN: 0,
  MAX: 999999,
  LOW_STOCK_THRESHOLD: 10,
} as const;

/**
 * Order constants
 */
export const ORDER = {
  PLATFORM_FEE_RATE: 0.02, // 2% platform commission
  SHIPPING_FEE_PER_VENDOR: 30_000, // 30k VND per vendor
  MIN_ORDER_AMOUNT: 10000, // 10,000 VND
  MAX_ITEMS_PER_ORDER: 100,
} as const;

/**
 * Multi-account limits
 */
export const ACCOUNT = {
  MAX_ACCOUNTS: 5,
  STORAGE_KEY: "vendoor_accounts",
} as const;

/**
 * Session/Auth
 */
export const AUTH = {
  SESSION_COOKIE: "better-auth.session_token",
  SESSION_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

/**
 * Rate limiting
 */
export const RATE_LIMIT = {
  API_REQUESTS_PER_MINUTE: 60,
  UPLOAD_REQUESTS_PER_HOUR: 20,
} as const;

/**
 * Cache durations (seconds)
 */
export const CACHE_DURATION = {
  STATIC_DATA: 3600, // 1 hour
  PRODUCTS: 300, // 5 minutes
  CATEGORIES: 1800, // 30 minutes
  USER_PROFILE: 600, // 10 minutes
} as const;

/**
 * Revalidation tags for Next.js cache
 */
export const REVALIDATE_TAGS = {
  PRODUCTS: "products",
  PRODUCT_DETAIL: (slug: string) => `product:${slug}`,
  CATEGORIES: "categories",
  VENDOR_PRODUCTS: (vendorId: string) => `vendor-products:${vendorId}`,
  ORDERS: "orders",
  ORDER_DETAIL: (orderId: string) => `order:${orderId}`,
  ADMIN_STATS: "admin-stats",
} as const;

/**
 * External service URLs
 */
export const EXTERNAL_URLS = {
  CLOUDINARY_BASE: "https://res.cloudinary.com",
  VNPAY_SANDBOX: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  VNPAY_PRODUCTION: "https://vnpayment.vn/paymentv2/vpcpay.html",
} as const;

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VN: /^(0|\+84)[0-9]{9,10}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  URL: /^https?:\/\/.+/,
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_TIME: "dd/MM/yyyy HH:mm",
  API: "yyyy-MM-dd",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

/**
 * Currency
 */
export const CURRENCY = {
  CODE: "VND",
  SYMBOL: "₫",
  LOCALE: "vi-VN",
} as const;

/**
 * Status values
 */
export const STATUS = {
  ORDER: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
  },
  VENDOR: {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },
  PRODUCT: {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
  },
} as const;

/**
 * Feature flags (for gradual rollout)
 */
export const FEATURE_FLAGS = {
  ENABLE_VNPAY: true,
  ENABLE_REVIEWS: false, // Not implemented yet
  ENABLE_WISHLIST: false, // Not implemented yet
  ENABLE_CHAT: false, // Not implemented yet
} as const;
