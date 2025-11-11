/**
 * Auth Feature - Server-Only API
 * Use in: Server Components, Server Actions, API Routes, Middleware
 */

// Server utils
export { getSession, getCurrentUser, getSellerStore } from "./lib/utils";

// Server guards
export {
  requireAuth,
  requireAdmin,
  requireSeller,
  requireSellerWithStore,
} from "./lib/guards";

// Re-export types & authorization
export type {
  UserRole,
  StoreStatus,
  AuthUser,
  StoreInfo,
  SellerStoreResult,
  SellerWithStore,
} from "./lib/types";

export { isAdmin, isSeller, hasRole } from "./lib/authorization";
