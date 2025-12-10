"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";
import { REVALIDATION_PATHS } from "@/shared/lib/constants";

import type { OrderStatus } from "@/generated/prisma";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Result<void>> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    REVALIDATION_PATHS.VENDOR_ORDERS(orderId).forEach(p => revalidatePath(p));
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật trạng thái đơn hàng");
  }
}

// Cập nhật trạng thái đơn hàng từ form action (cho vendor)
export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as OrderStatus;
  await updateOrderStatus(orderId, status);
}
