"use server";

import prisma from "@/server/db/prisma";
import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import {
  updateQuantitySchema,
  type UpdateQuantityInput,
} from "../schemas/cart.schema";
import type { ActionResponse } from "@/types/action-response";

export async function updateQuantity(
  input: UpdateQuantityInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const { user } = await getSession();

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    const validatedData = updateQuantitySchema.parse(input);
    const { productId, quantity } = validatedData;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { cart: true },
    });

    const currentCart = (dbUser?.cart as Record<string, number>) || {};

    if (quantity === 0) {
      delete currentCart[productId];
    } else {
      currentCart[productId] = quantity;
    }

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
    console.error("Update quantity error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể cập nhật số lượng",
    };
  }
}
