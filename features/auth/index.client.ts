// Components
export { SignInForm } from "./components/client/SignInForm.client";
export { SignUpForm } from "./components/client/SignUpForm.client";
export { UserButton } from "./components/client/UserButton/UserButton.client";
export { UserAvatar } from "./components/client/UserButton/UserAvatar.client";
export { AuthRedirectToast } from "./components/client/AuthRedirectToast.client";

// Client utils
export { authClient, useSession, signIn, signUp, signOut } from "./lib/client";

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
