"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import { addToCartSchema, type AddToCartInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/types/action-response";

export async function addToCart(
  input: AddToCartInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const { user } = await getSession();

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      };
    }

    const validatedData = addToCartSchema.parse(input);
    const { productId } = validatedData;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        error: "Sản phẩm không tồn tại",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { cart: true },
    });

    const currentCart = (dbUser?.cart as Record<string, number>) || {};
    const newCart = {
      ...currentCart,
      [productId]: (currentCart[productId] || 0) + 1,
    };

    await prisma.user.update({
      where: { id: user.id },
      data: { cart: newCart },
    });

    const total = Object.values(newCart).reduce((sum, qty) => sum + qty, 0);

    revalidatePath("/cart");
    revalidatePath("/product/[productId]", "page");

    return {
      success: true,
      data: { total },
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể thêm vào giỏ hàng",
    };
  }
}
