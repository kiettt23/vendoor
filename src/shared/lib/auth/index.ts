/**
 * Auth Module - Barrel Export
 *
 * Centralized exports for auth utilities
 *
 * ⚠️ IMPORTANT: Guards đã được di chuyển ra entities để tuân thủ FSD
 * - User guards (requireAuth, requireRole, requireAdmin, hasRole):
 *   import { requireAuth } from "@/entities/user"
 * - Vendor guards (requireVendor):
 *   import { requireVendor } from "@/entities/vendor"
 */

// Server-side auth
export { auth } from "./config";
export type { Session } from "./config";

// Session primitives (chỉ check session, không query DB)
export { getSession, requireSession } from "./session";

// Client-side auth
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession as getClientSession,
} from "./client";

// Error handling
export { translateAuthError } from "./error-messages";
