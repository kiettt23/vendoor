"use client";

import { createAuthClient } from "better-auth/react";
import { multiSessionClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [usernameClient(), multiSessionClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
