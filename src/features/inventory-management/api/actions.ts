"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result, createLogger } from "@/shared/lib/utils";
import { REVALIDATION_PATHS, CACHE_TAGS } from "@/shared/lib/constants";
import { getZodFirstError } from "@/shared/lib/validation";

const logger = createLogger("inventory-management");

import {
  bulkUpdateStockSchema,
  updateStockSchema,
  type BulkUpdateStockInput,
  type UpdateStockInput,
} from "../model";

// ============================================================================
// Helpers
// ============================================================================

function revalidateInventoryCache(vendorId: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS, "max");
  revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId), "max");
  REVALIDATION_PATHS.VENDOR_PRODUCTS.forEach((p) => revalidatePath(p));
}

// ============================================================================
// Actions
// ============================================================================

export async function updateStock(
  vendorId: string,
  input: UpdateStockInput
): Promise<Result<void>> {
  const parsed = updateStockSchema.safeParse(input);
  if (!parsed.success) {
    return err(getZodFirstError(parsed.error));
  }

  const { variantId, stock } = parsed.data;

  try {
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

    revalidateInventoryCache(vendorId);
    return ok(undefined);
  } catch (error) {
    logger.error("updateStock error:", error);
    return err("Không thể cập nhật tồn kho");
  }
}

export async function bulkUpdateStock(
  vendorId: string,
  input: BulkUpdateStockInput
): Promise<Result<{ updated: number }>> {
  const parsed = bulkUpdateStockSchema.safeParse(input);
  if (!parsed.success) {
    return err(getZodFirstError(parsed.error));
  }

  const { updates } = parsed.data;

  try {
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

    await prisma.$transaction(
      updates.map(({ variantId, stock }) =>
        prisma.productVariant.update({
          where: { id: variantId },
          data: { stock },
        })
      )
    );

    revalidateInventoryCache(vendorId);
    return ok({ updated: updates.length });
  } catch (error) {
    logger.error("bulkUpdateStock error:", error);
    return err("Không thể cập nhật tồn kho");
  }
}
