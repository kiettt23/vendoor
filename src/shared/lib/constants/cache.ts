/**
 * Cache Duration Constants (in seconds)
 * Used for unstable_cache and revalidate options
 */
export const CACHE_DURATION = {
  // Static data - rarely changes
  STATIC: 3600, // 1 hour
  CATEGORIES: 1800, // 30 minutes

  // Product data - moderate changes
  PRODUCTS: 300, // 5 minutes
  PRODUCT_DETAIL: 120, // 2 minutes (price/stock sensitive)
  RELATED_PRODUCTS: 600, // 10 minutes

  // User-specific data
  USER_PROFILE: 300, // 5 minutes
  ORDERS: 60, // 1 minute

  // Vendor data
  VENDOR_PROFILE: 600, // 10 minutes
  VENDOR_PRODUCTS: 300, // 5 minutes
  VENDOR_STATS: 300, // 5 minutes

  // Admin data
  ADMIN_STATS: 60, // 1 minute (needs fresh data)

  // Search
  SEARCH_RESULTS: 120, // 2 minutes

  // Fresh data - no cache
  FRESH: 0,
} as const;

/**
 * React Query staleTime configuration (in milliseconds)
 * Controls when data is considered "stale" and needs refetching
 */
export const STALE_TIME = {
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  PRODUCT_DETAIL: 2 * 60 * 1000, // 2 minutes
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
  ORDERS: 1 * 60 * 1000, // 1 minute
  SEARCH: 2 * 60 * 1000, // 2 minutes
  STOCK: 30 * 1000, // 30 seconds (critical)
  CART: 0, // Always fresh
  WISHLIST: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * React Query gcTime (garbage collection time) in milliseconds
 * Controls how long inactive queries stay in cache
 */
export const GC_TIME = {
  DEFAULT: 30 * 60 * 1000, // 30 minutes
  SHORT: 5 * 60 * 1000, // 5 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Cache Tags for granular invalidation
 * Used with revalidateTag() for targeted cache clearing
 */
export const CACHE_TAGS = {
  // Product tags
  PRODUCTS: "products",
  PRODUCT: (slug: string) => `product:${slug}`,
  PRODUCTS_BY_CATEGORY: (categorySlug: string) =>
    `products:category:${categorySlug}`,
  PRODUCTS_BY_VENDOR: (vendorId: string) => `products:vendor:${vendorId}`,
  FEATURED_PRODUCTS: "products:featured",
  RELATED_PRODUCTS: (productId: string) => `products:related:${productId}`,

  // Category tags
  CATEGORIES: "categories",
  CATEGORY: (slug: string) => `category:${slug}`,

  // Vendor tags
  VENDORS: "vendors",
  VENDOR: (slug: string) => `vendor:${slug}`,
  VENDOR_STATS: (vendorId: string) => `vendor:stats:${vendorId}`,

  // Order tags
  ORDERS: "orders",
  ORDER: (id: string) => `order:${id}`,
  ORDERS_BY_USER: (userId: string) => `orders:user:${userId}`,
  ORDERS_BY_VENDOR: (vendorId: string) => `orders:vendor:${vendorId}`,

  // Review tags
  REVIEWS: "reviews",
  REVIEWS_BY_PRODUCT: (productId: string) => `reviews:product:${productId}`,

  // Admin tags
  ADMIN_STATS: "admin:stats",
  ADMIN_VENDORS: "admin:vendors",
  ADMIN_ORDERS: "admin:orders",

  // User tags
  USER_PROFILE: (userId: string) => `user:${userId}`,
} as const;
