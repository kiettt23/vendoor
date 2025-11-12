"use server";

import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import { removeItemSchema, type RemoveItemInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/shared/types/action-response";
import { cartService } from "../lib/cart.service";

export async function removeItem(
  input: RemoveItemInput
): Promise<ActionResponse> {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    const validatedData = removeItemSchema.parse(input);
    const { productId } = validatedData;

    const result = await cartService.removeItem(user.id, productId);

    revalidatePath("/cart");

    return {
      success: true,
      data: { total: result.total },
    };
  } catch (error) {
    console.error("Remove item error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa sản phẩm",
    };
  }
}
