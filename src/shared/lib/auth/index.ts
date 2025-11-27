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
