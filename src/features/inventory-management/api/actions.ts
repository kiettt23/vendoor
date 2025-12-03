"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";

import {
  bulkUpdateStockSchema,
  updateStockSchema,
  type BulkUpdateStockInput,
  type UpdateStockInput,
} from "../model/types";

/**
 * Update stock for a single variant
 */
export async function updateStock(
  vendorId: string,
  input: UpdateStockInput
): Promise<Result<void>> {
  const parsed = updateStockSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ");
  }

  const { variantId, stock } = parsed.data;

  try {
    // Verify ownership
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: variantId,
        product: { vendorId },
      },
    });

    if (!variant) {
      return err("Không tìm thấy sản phẩm hoặc không có quyền");
    }

    await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock },
    });

    revalidatePath("/vendor/inventory");
    revalidatePath("/vendor/products");
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật tồn kho");
  }
}

/**
 * Bulk update stock for multiple variants
 */
export async function bulkUpdateStock(
  vendorId: string,
  input: BulkUpdateStockInput
): Promise<Result<{ updated: number }>> {
  const parsed = bulkUpdateStockSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ");
  }

  const { updates } = parsed.data;

  try {
    // Verify ownership of all variants
    const variantIds = updates.map((u) => u.variantId);
    const ownedVariants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        product: { vendorId },
      },
      select: { id: true },
    });

    const ownedIds = new Set(ownedVariants.map((v) => v.id));
    const unauthorizedIds = variantIds.filter((id) => !ownedIds.has(id));

    if (unauthorizedIds.length > 0) {
      return err(`Không có quyền cập nhật ${unauthorizedIds.length} sản phẩm`);
    }

    // Bulk update using transaction
    await prisma.$transaction(
      updates.map(({ variantId, stock }) =>
        prisma.productVariant.update({
          where: { id: variantId },
          data: { stock },
        })
      )
    );

    revalidatePath("/vendor/inventory");
    revalidatePath("/vendor/products");
    return ok({ updated: updates.length });
  } catch {
    return err("Không thể cập nhật tồn kho");
  }
}
