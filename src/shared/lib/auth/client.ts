/**
 * Auth Client - Better Auth Client Setup
 *
 * File này chứa client-side auth hooks và utilities.
 * Import: import { authClient, signIn, signOut } from "@/lib/auth"
 */

import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  multiSessionClient,
} from "better-auth/client/plugins";
import type { auth } from "./config";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    // Infer additional fields from server auth config
    inferAdditionalFields<typeof auth>(),
    // Multi-session support for switching accounts
    multiSessionClient(),
  ],
});

// Export các method chính
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
