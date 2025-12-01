/**
 * Query & Display Limits
 *
 * Centralize tất cả magic numbers cho pagination, limits.
 */

export const LIMITS = {
  // Dashboard
  RECENT_ORDERS: 5,
  RECENT_PRODUCTS: 6,

  // Product
  RELATED_PRODUCTS: 4,
  PRODUCTS_PER_PAGE: 12,
  FEATURED_PRODUCTS: 8,

  // Order
  ORDERS_PER_PAGE: 10,

  // Search
  SEARCH_RESULTS: 10,
  AUTOCOMPLETE: 5,

  // Image
  MAX_PRODUCT_IMAGES: 5,
  FIRST_IMAGE: 1,

  // Review
  REVIEWS_PER_PAGE: 10,

  // Admin
  ADMIN_CATEGORIES_PER_PAGE: 50,
  ADMIN_PRODUCTS_PER_PAGE: 20,
  ADMIN_ORDERS_PER_PAGE: 20,
  ADMIN_USERS_PER_PAGE: 50,
} as const;
