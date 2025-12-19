"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { tryCatch, type AsyncVoidResult } from "@/shared/lib/utils";
import { REVALIDATION_PATHS, CACHE_TAGS } from "@/shared/lib/constants";
import type { OrderStatus } from "@/generated/prisma";

// ============================================================================
// Helpers
// ============================================================================

function revalidateOrderCache(
  orderId: string,
  vendorId: string,
  customerId: string
) {
  revalidateTag(CACHE_TAGS.ORDERS, "max");
  revalidateTag(CACHE_TAGS.ORDER(orderId), "max");
  revalidateTag(CACHE_TAGS.ORDERS_BY_VENDOR(vendorId), "max");
  revalidateTag(CACHE_TAGS.ORDERS_BY_USER(customerId), "max");
  revalidateTag(CACHE_TAGS.VENDOR_STATS(vendorId), "max");
  REVALIDATION_PATHS.VENDOR_ORDERS(orderId).forEach((p) => revalidatePath(p));
}

// ============================================================================
// Actions
// ============================================================================

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): AsyncVoidResult {
  return tryCatch(async () => {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true, vendorId: true, customerId: true },
    });
    revalidateOrderCache(orderId, order.vendorId, order.customerId);
  }, "Không thể cập nhật trạng thái đơn hàng");
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as OrderStatus;
  await updateOrderStatus(orderId, status);
}
