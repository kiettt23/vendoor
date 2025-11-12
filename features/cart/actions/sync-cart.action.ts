"use server";

import { getSession } from "@/features/auth/index.server";
import { syncCartSchema, type SyncCartInput } from "../schemas/cart.schema";
import type { ActionResponse } from "@/types/action-response";
import { cartService } from "../lib/cart.service";

export async function syncCart(input: SyncCartInput): Promise<ActionResponse> {
  try {
    const session = await getSession();
    const user = session?.user;

    if (!user) {
      return {
        success: false,
        error: "Vui lòng đăng nhập",
      };
    }

    const validatedData = syncCartSchema.parse(input);
    const { items } = validatedData;

    const result = await cartService.syncCart(user.id, items);

    return {
      success: true,
      data: { total: result.total },
    };
  } catch (error) {
    console.error("Sync cart error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể đồng bộ giỏ hàng",
    };
  }
}
