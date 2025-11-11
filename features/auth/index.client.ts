/**
 * Auth Feature - Client Components & Hooks
 * Import from: @/features/auth/index.client
 */

// Client Components
export { SignInForm } from "./components/client/SignInForm.client";
export { SignUpForm } from "./components/client/SignUpForm.client";
export { UserButton } from "./components/client/UserButton/UserButton.client";
export { UserAvatar } from "./components/client/UserButton/UserAvatar.client";
export { AuthRedirectToast } from "./components/client/AuthRedirectToast.client";

// Client utilities
export { authClient, useSession, signIn, signUp, signOut } from "./lib/client";
