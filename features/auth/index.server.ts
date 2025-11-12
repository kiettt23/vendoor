// Server utils
export { getSession, getCurrentUser, getSellerStore } from "./lib/utils";

// Guards
export {
  requireAuth,
  requireAdmin,
  requireSeller,
  requireSellerWithStore,
} from "./lib/guards";

// Actions
export { signInAction, signInWithRedirect } from "./actions/sign-in.action";
export { signUpAction, signUpWithRedirect } from "./actions/sign-up.action";
export { signOutAction, signOutWithRedirect } from "./actions/sign-out.action";
export { updateUserAction } from "./actions/update-user.action";

// Authorization
export { isAdmin, isSeller, hasRole } from "./lib/authorization";

// Config
export { auth } from "./lib/config";

// Constants
export { AUTH_ROUTES, SESSION_CONFIG, ADMIN_CONFIG } from "./lib/constants";

// Schemas
export {
  signInSchema,
  signUpSchema,
  updateUserSchema,
} from "./schemas/auth.schema";

// Types
export type * from "./types/auth.types";
export type {
  SignInInput,
  SignUpInput,
  UpdateUserInput,
} from "./schemas/auth.schema";
