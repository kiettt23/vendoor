"use server";

import { auth } from "../lib/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "../lib/constants";

interface SignInInput {
  email: string;
  password: string;
  rememberMe?: boolean;
  callbackURL?: string;
}

export async function signInAction(input: SignInInput) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
        rememberMe: input.rememberMe ?? true,
        callbackURL: input.callbackURL,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: "Email hoặc mật khẩu không đúng",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("SIGN_IN_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    };
  }
}

export async function signInWithRedirect(input: SignInInput) {
  const result = await signInAction(input);

  if (result.success) {
    redirect(input.callbackURL || AUTH_ROUTES.HOME);
  }

  return result;
}
