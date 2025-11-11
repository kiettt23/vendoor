/**
 * Auth Lib - Internal API
 *
 * ⚠️ KHÔNG IMPORT TRỰC TIẾP TỪ FILE NÀY
 * Sử dụng:
 * - "@/features/auth" cho Client code
 * - "@/features/auth/server" cho Server code
 */

// Config
export { auth } from "./config";

// Client
export { authClient, useSession, signIn, signUp, signOut } from "./client";

// Types
export type {
  UserRole,
  AuthUser,
  StoreInfo,
  SellerStoreResult,
  SellerWithStore,
} from "./types";

// Server utilities (⚠️ Dùng next/headers - Server only!)
export { getSession, getCurrentUser, getSellerStore } from "./utils";

// Authorization (Pure functions - Safe)
export { isAdmin, isSeller, hasRole } from "./authorization";

// Guards (⚠️ Server only!)
export {
  requireAuth,
  requireAdmin,
  requireSeller,
  requireSellerWithStore,
} from "./guards";
