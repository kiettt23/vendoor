// Server exports
export { auth } from "../auth";
export {
  getSession,
  getCurrentUser,
  requireAuth,
  requireAdmin,
  requireSeller,
} from "./helpers";

// Client exports
export { authClient, useSession, signIn, signUp, signOut } from "./client";
