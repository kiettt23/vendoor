/**
 * Application Routes Constants
 *
 * Centralized route definitions to avoid hardcoded paths.
 * Usage: import { ROUTES } from "@/lib/constants"
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  PRODUCTS: "/products",
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
  ORDER_DETAIL: (id: string) => `/orders/${id}`,

  // Vendor routes
  VENDOR_DASHBOARD: "/vendor",
  VENDOR_PRODUCTS: "/vendor/products",
  VENDOR_PRODUCT_CREATE: "/vendor/products/create",
  VENDOR_PRODUCT_EDIT: (id: string) => `/vendor/products/${id}/edit`,
  VENDOR_ORDERS: "/vendor/orders",
  VENDOR_ORDER_DETAIL: (id: string) => `/vendor/orders/${id}`,

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

/**
 * Protected routes that require authentication
 */
export const PROTECTED_ROUTES = [
  "/cart",
  "/checkout",
  "/orders",
  "/vendor",
  "/admin",
] as const;

/**
 * Routes that require specific roles
 */
export const ROLE_ROUTES = {
  VENDOR: ["/vendor"],
  ADMIN: ["/admin"],
} as const;
