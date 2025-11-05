// Application-wide constants

// API Routes
export const API_ROUTES = {
  CART: "/api/cart",
  AI: "/api/ai",
  WEBHOOKS: {
    STRIPE: "/api/webhooks/stripe",
    INNGEST: "/api/webhooks/inngest",
  },
} as const;

// App Routes
export const APP_ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  CART: "/cart",
  ORDERS: "/orders",
  PRICING: "/pricing",
  CREATE_STORE: "/create-store",

  // Admin
  ADMIN: {
    DASHBOARD: "/admin",
    APPROVE: "/admin/approve",
    COUPONS: "/admin/coupons",
    STORES: "/admin/stores",
  },

  // Seller
  STORE: {
    DASHBOARD: "/store",
    ADD_PRODUCT: "/store/add-product",
    MANAGE_PRODUCTS: "/store/manage-product",
    ORDERS: "/store/orders",
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Product
export const PRODUCT = {
  MAX_IMAGES: 5,
  MIN_IMAGES: 1,
  MAX_NAME_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 2000,
} as const;

// Order
export const ORDER = {
  MIN_ORDER_AMOUNT: 0,
  FREE_SHIPPING_THRESHOLD: 500000, // 500k VND
} as const;

// File Upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
} as const;

// Coupon
export const COUPON = {
  MIN_DISCOUNT: 0,
  MAX_DISCOUNT: 100,
  CODE_LENGTH: 8,
} as const;

// Rating
export const RATING = {
  MIN_STARS: 1,
  MAX_STARS: 5,
  MAX_COMMENT_LENGTH: 1000,
} as const;
