"use server";

import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import { addToCartSchema, type AddToCartInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/shared/types/action-response";
import { cartService } from "../lib/cart.service";

export async function addToCart(
  input: AddToCartInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      };
    }

    const validatedData = addToCartSchema.parse(input);
    const { productId, quantity = 1 } = validatedData;

    const result = await cartService.addToCart(user.id, productId, quantity);

    revalidatePath("/cart");
    revalidatePath("/product/[productId]", "page");

    return {
      success: true,
      data: { total: result.total },
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng",
    };
  }
}
