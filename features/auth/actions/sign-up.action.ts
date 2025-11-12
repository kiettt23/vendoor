"use server";

import { auth } from "../lib/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "../lib/constants";

interface SignUpInput {
  email: string;
  password: string;
  name: string;
  username?: string;
  image?: string;
  callbackURL?: string;
}

export async function signUpAction(input: SignUpInput) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        username: input.username,
        image: input.image,
        callbackURL: input.callbackURL,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: "Đăng ký thất bại",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("SIGN_UP_ERROR:", error);

    if (error instanceof Error && error.message?.includes("email")) {
      return {
        success: false,
        error: "Email đã được sử dụng",
      };
    }

    if (error instanceof Error && error.message?.includes("username")) {
      return {
        success: false,
        error: "Username đã được sử dụng",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
    };
  }
}

export async function signUpWithRedirect(input: SignUpInput) {
  const result = await signUpAction(input);

  if (result.success && input.callbackURL) {
    redirect(input.callbackURL);
  }

  return result;
}
