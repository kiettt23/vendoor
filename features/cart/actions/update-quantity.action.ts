"use server";

import prisma from "@/shared/configs/prisma";
import { getSession } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";
import {
  updateQuantitySchema,
  type UpdateQuantityInput,
} from "../schemas/cart.schema";
import type { ActionResponse } from "@/shared/types/action-response";
import { cartService } from "../lib/cart.service";

export async function updateQuantity(
  input: UpdateQuantityInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validatedData = updateQuantitySchema.parse(input);
    const { productId, quantity } = validatedData;

    const result = await cartService.updateQuantity(
      userId,
      productId,
      quantity
    );

    revalidatePath("/cart");

    return {
      success: true,
      data: { total: result.total },
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
