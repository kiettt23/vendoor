"use server";

import { auth } from "../lib/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "../lib/constants";

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("SIGN_OUT_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đăng xuất thất bại",
    };
  }
}

export async function signOutWithRedirect(redirectTo?: string) {
  await signOutAction();
  redirect(redirectTo || AUTH_ROUTES.HOME);
}
