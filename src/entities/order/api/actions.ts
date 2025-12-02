"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";

import type { OrderStatus } from "@/generated/prisma/client/enums";

// ============================================
// Order Actions
// ============================================

/**
 * Cập nhật trạng thái đơn hàng (cho vendor)
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Result<void>> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath(`/vendor/orders/${orderId}`);
    revalidatePath("/vendor/orders");
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật trạng thái đơn hàng");
  }
}

/**
 * Cập nhật trạng thái đơn hàng từ form action (cho vendor)
 */
export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as OrderStatus;
  await updateOrderStatus(orderId, status);
}
