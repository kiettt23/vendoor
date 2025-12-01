/**
 * Auth Module - Barrel Export
 *
 * Centralized exports for auth utilities
 * Usage: import { auth, authClient, signIn, signOut } from "@/lib/auth"
 */

// Server-side auth
export { auth } from "./config";
export type { Session } from "./config";

// Client-side auth
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} from "./client";

// Error handling
export { translateAuthError } from "./error-messages";

// Auth Guards (Server-side)
export {
  requireAuth,
  requireRole,
  requireVendor,
  requireAdmin,
  getAuthSession,
  hasRole,
} from "./guards";
export type { UserRole, AuthResult } from "./guards";
