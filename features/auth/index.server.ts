/**
 * Auth Feature - Server Components & Utilities
 * Import from: @/features/auth/index.server
 *
 * ⚠️ Server-only imports - DO NOT import in client components
 */

// Server utilities
export { getSession, getCurrentUser, getSellerStore } from "./lib/utils";

// Auth guards
export {
  requireAuth,
  requireAdmin,
  requireSeller,
  requireSellerWithStore,
} from "./lib/guards";

// Server Actions
export { signInAction, signInWithRedirect } from "./actions/sign-in.action";
export { signUpAction, signUpWithRedirect } from "./actions/sign-up.action";
export { signOutAction, signOutWithRedirect } from "./actions/sign-out.action";
export { updateUserAction } from "./actions/update-user.action";

// Authorization helpers (can be used server-side)
export { isAdmin, isSeller, hasRole } from "./lib/authorization";

// Types
export type {
  UserRole,
  StoreStatus,
  AuthUser,
  StoreInfo,
  SellerStoreResult,
  SellerWithStore,
  DeviceSession,
} from "./lib/types";
