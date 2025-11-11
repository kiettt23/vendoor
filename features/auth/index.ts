/**
 * Auth Feature - Client & Shared API
 * Server-only imports: "@/features/auth/server"
 */

// Config & Types
export { auth } from "./lib/config";
export type {
  UserRole,
  StoreStatus,
  AuthUser,
  StoreInfo,
  SellerStoreResult,
  SellerWithStore,
} from "./lib/types";

// Client
export { authClient, useSession, signIn, signUp, signOut } from "./lib/client";

// Authorization (Pure functions)
export { isAdmin, isSeller, hasRole } from "./lib/authorization";

// Components
export { UserButton } from "./components/UserButton";
export { default as LoginForm } from "./components/LoginForm";
export { default as SignUpForm } from "./components/SignUpForm";
export { AuthRedirectToast } from "./components/AuthRedirectToast";
