export { auth } from "./config";

// Guards (throw errors - use in server actions)
export {
  requireAuth,
  requireRole,
  requireSeller,
  requireAdmin,
  requireSellerWithStore,
} from "./guards";

// Utils (safe - use in components)
export {
  getSession,
  getCurrentUser,
  hasRole,
  isSeller,
  isAdmin,
  checkIsSeller,
  checkIsAdmin,
} from "./utils";

// Client hooks
export { authClient, useSession, signIn, signUp, signOut } from "./client";

// Types
export type {
  UserRole,
  StoreInfo,
  SellerCheckResult,
  SellerWithStore,
} from "./types";
