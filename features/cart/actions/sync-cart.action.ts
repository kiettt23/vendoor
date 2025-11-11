"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/features/auth/index.server";
import { syncCartSchema, type SyncCartInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/types/action-response";

export async function syncCart(
  input: SyncCartInput
): Promise<ActionResponse<{ total: number }>> {
  try {
    const { user } = await getSession();

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    const validatedData = syncCartSchema.parse(input);
    const { items } = validatedData;

    await prisma.user.update({
      where: { id: user.id },
      data: { cart: items },
    });

    const total = Object.values(items).reduce((sum, qty) => sum + qty, 0);

    return {
      success: true,
      data: { total },
    };
  } catch (error) {
    console.error("Sync cart error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể đồng bộ giỏ hàng",
    };
  }
}
