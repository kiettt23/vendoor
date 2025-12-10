export const ROUTES = {
  // Public routes
  HOME: "/",
  FLASH_SALE: "/flash-sale",
  PRODUCTS: "/products",
  STORES: "/stores",
  STORE_DETAIL: (id: string) => `/stores/${id}`,
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,

  // Auth routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // Customer routes
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/orders/success",
  ORDERS: "/orders",
  ACCOUNT: "/account",
  WISHLIST: "/wishlist",
  BECOME_VENDOR: "/become-vendor",
  ACCOUNT_PROFILE: "/account/profile",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,

  // Vendor routes
  VENDOR_DASHBOARD: "/vendor",
  VENDOR_PRODUCTS: "/vendor/products",
  VENDOR_PRODUCT_CREATE: "/vendor/products/new",
  VENDOR_ORDERS: "/vendor/orders",
  VENDOR_INVENTORY: "/vendor/inventory",
  VENDOR_REVIEWS: "/vendor/reviews",
  VENDOR_ANALYTICS: "/vendor/analytics",
  VENDOR_EARNINGS: "/vendor/earnings",
  VENDOR_ORDER_DETAIL: (id: string) => `/vendor/orders/${id}`,
  VENDOR_PRODUCT_EDIT: (id: string) => `/vendor/products/${id}/edit`,

  // Admin routes
  ADMIN_DASHBOARD: "/admin",
  ADMIN_VENDORS: "/admin/vendors",
  ADMIN_VENDOR_DETAIL: (id: string) => `/admin/vendors/${id}`,
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id: string) => `/admin/orders/${id}`,
  ADMIN_CATEGORIES: "/admin/categories",

  // API routes
  API: {
    AUTH: "/api/auth",
    UPLOAD: "/api/upload",
    WEBHOOKS: "/api/webhooks",
  },
} as const;

// Revalidation path groups for cache invalidation
// Usage: REVALIDATION_PATHS.VENDOR_PRODUCTS.forEach(path => revalidatePath(path))
export const REVALIDATION_PATHS = {
  PRODUCTS: [ROUTES.PRODUCTS],
  WISHLIST: [ROUTES.WISHLIST],
  CATEGORIES: [ROUTES.ADMIN_CATEGORIES, ROUTES.HOME, ROUTES.PRODUCTS],
  REVIEWS: [ROUTES.PRODUCTS, ROUTES.VENDOR_REVIEWS],
  VENDOR_PRODUCTS: [ROUTES.VENDOR_PRODUCTS, ROUTES.VENDOR_INVENTORY],
  VENDOR_ORDERS: (orderId: string) => [
    ROUTES.VENDOR_ORDER_DETAIL(orderId),
    ROUTES.VENDOR_ORDERS,
  ],
  ADMIN_VENDORS: (vendorId: string) => [
    ROUTES.ADMIN_VENDORS,
    ROUTES.ADMIN_VENDOR_DETAIL(vendorId),
  ],
} as const;
