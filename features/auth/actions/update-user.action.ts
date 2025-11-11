"use server";

import { auth } from "../lib/config";
import { headers } from "next/headers";

interface UpdateUserInput {
  name?: string;
  username?: string;
  image?: string;
}

export async function updateUserAction(input: UpdateUserInput) {
  try {
    const result = await auth.api.updateUser({
      body: input,
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: "Cập nhật thất bại",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("UPDATE_USER_ERROR:", error);

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
