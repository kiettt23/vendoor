/**
 * React Query Keys - Centralized key factory
 *
 * Pattern: [entity, ...filters] for automatic invalidation
 * Example: queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 */
export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.all, "list", filters] as const,
    detail: (slug: string) => [...queryKeys.products.all, "detail", slug] as const,
    search: (query: string) => [...queryKeys.products.all, "search", query] as const,
    byCategory: (categorySlug: string) =>
      [...queryKeys.products.all, "category", categorySlug] as const,
    byVendor: (vendorId: string) =>
      [...queryKeys.products.all, "vendor", vendorId] as const,
    related: (productId: string) =>
      [...queryKeys.products.all, "related", productId] as const,
    featured: () => [...queryKeys.products.all, "featured"] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    withCount: () => [...queryKeys.categories.all, "withCount"] as const,
    detail: (slug: string) => [...queryKeys.categories.all, "detail", slug] as const,
  },

  // Vendors
  vendors: {
    all: ["vendors"] as const,
    detail: (slug: string) => [...queryKeys.vendors.all, "detail", slug] as const,
    products: (vendorId: string) =>
      [...queryKeys.vendors.all, "products", vendorId] as const,
    stats: (vendorId: string) =>
      [...queryKeys.vendors.all, "stats", vendorId] as const,
  },

  // Cart
  cart: {
    all: ["cart"] as const,
    items: () => [...queryKeys.cart.all, "items"] as const,
    stock: (variantIds: string[]) =>
      [...queryKeys.cart.all, "stock", ...variantIds.sort()] as const,
    count: () => [...queryKeys.cart.all, "count"] as const,
  },

  // Wishlist
  wishlist: {
    all: ["wishlist"] as const,
    items: () => [...queryKeys.wishlist.all, "items"] as const,
    check: (productId: string) =>
      [...queryKeys.wishlist.all, "check", productId] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.orders.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
    byUser: (userId: string) => [...queryKeys.orders.all, "user", userId] as const,
    byVendor: (vendorId: string) =>
      [...queryKeys.orders.all, "vendor", vendorId] as const,
  },

  // Reviews
  reviews: {
    all: ["reviews"] as const,
    byProduct: (productId: string) =>
      [...queryKeys.reviews.all, "product", productId] as const,
    byUser: (userId: string) => [...queryKeys.reviews.all, "user", userId] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    addresses: () => [...queryKeys.user.all, "addresses"] as const,
  },

  // Admin
  admin: {
    all: ["admin"] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
    vendors: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "vendors", filters] as const,
    orders: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "orders", filters] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
