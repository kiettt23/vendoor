/**
 * Application Routes Configuration
 * Centralized route definitions for the entire application
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  SHOP: "/shop",
  PRODUCT: (slug: string) => `/product/${slug}`,
  STORE_SHOP: (username: string) => `/shop/${username}`,
  PRICING: "/pricing",

  // Auth routes
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },

  // Customer routes
  CUSTOMER: {
    CART: "/cart",
    ORDERS: "/orders",
    CREATE_STORE: "/create-store",
  },

  // Vendor routes
  VENDOR: {
    DASHBOARD: "/vendor",
    ADD_PRODUCT: "/vendor/add-product",
    MANAGE_PRODUCTS: "/vendor/manage-product",
    EDIT_PRODUCT: (id: string) => `/vendor/manage-product/edit/${id}`,
    ORDERS: "/vendor/orders",
    SETTINGS: "/vendor/settings",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin",
    STORES: "/admin/stores",
    APPROVE: "/admin/approve",
    COUPONS: "/admin/coupons",
  },

  // API routes
  API: {
    AUTH: "/api/auth",
    WEBHOOKS: {
      STRIPE: "/api/webhooks/stripe",
    },
  },
} as const;

/**
 * Route type helper
 */
export type AppRoute = typeof ROUTES;
