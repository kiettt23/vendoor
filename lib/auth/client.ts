import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client
 *
 * This is the client-side auth instance.
 * Use this in React components for authentication.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Export commonly used methods
export const { useSession, signIn, signUp, signOut } = authClient;
