/**
 * Server-side Auth Exports
 * 
 * KHÔNG import trong client components!
 * Sử dụng "@/lib/auth/client" cho client-side
 */

export { auth } from "./config";

export { requireAuth, requireAdmin, requireSeller, requireSellerWithStore } from "./guards";

export { getSession, getCurrentUser, getSellerStore } from "./utils";

export { isAdmin, isSeller, hasRole } from "./authorization";

export type { AuthUser, UserRole, StoreInfo, SellerCheckResult, SellerWithStore } from "./types";
