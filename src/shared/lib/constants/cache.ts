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
