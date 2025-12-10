import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  multiSessionClient,
} from "better-auth/client/plugins";
import { APP_URL } from "@/shared/lib/constants";
import type { auth } from "./config";

export const authClient = createAuthClient({
  baseURL: APP_URL,
  plugins: [
    // Infer additional fields from server auth config
    inferAdditionalFields<typeof auth>(),
    // Multi-session support for switching accounts
    multiSessionClient(),
  ],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
