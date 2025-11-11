"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import { removeItemSchema, type RemoveItemInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/types/action-response";

export async function removeItem(
  input: RemoveItemInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const { user } = await getSession();

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    const validatedData = removeItemSchema.parse(input);
    const { productId } = validatedData;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { cart: true },
    });

    const currentCart = (dbUser?.cart as Record<string, number>) || {};
    delete currentCart[productId];

    await prisma.user.update({
      where: { id: user.id },
      data: { cart: currentCart },
    });

    const total = Object.values(currentCart).reduce((sum, qty) => sum + qty, 0);

    revalidatePath("/cart");

    return {
      success: true,
      data: { total },
    };
  } catch (error) {
    console.error("Remove item error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa sản phẩm",
    };
  }
}
