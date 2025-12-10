/**
 * ⚠️ IMPORTANT: File này chỉ export CLIENT-SAFE code
 * 
 * Để import server-only code:
 * - Auth config: import { auth } from "@/shared/lib/auth/config"
 * - Server session: import { getSession, requireSession } from "@/shared/lib/auth/session"
 *
 */

// Re-export Session type (type-only, safe for client)
export type { Session } from "./config";

// Client-side auth
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession as getClientSession,
} from "./client";
export { translateAuthError } from "./error-messages";
