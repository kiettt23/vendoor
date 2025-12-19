"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/db";
import {
  ok,
  err,
  tryCatch,
  type AsyncResult,
  type AsyncVoidResult,
  createLogger,
} from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/constants";

const logger = createLogger("wishlist");

// ============================================================================
// Helpers
// ============================================================================

function revalidateWishlistCache() {
  revalidatePath(ROUTES.WISHLIST);
}

// ============================================================================
// Actions
// ============================================================================

export async function addToWishlist(
  userId: string,
  productId: string
): AsyncResult<string> {
  try {
    // Guard: Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true },
    });
    if (!product) return err("Sản phẩm không tồn tại hoặc đã ngừng bán");

    // Guard: Check not already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) return err("Sản phẩm đã có trong danh sách yêu thích");

    // Create
    const item = await prisma.wishlist.create({
      data: { userId, productId },
    });

    revalidateWishlistCache();
    return ok(item.id);
  } catch (error) {
    logger.error("addToWishlist error:", error);
    return err("Không thể thêm vào danh sách yêu thích");
  }
}

export async function removeFromWishlist(
  userId: string,
  productId: string
): AsyncVoidResult {
  return tryCatch(async () => {
    await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
    revalidateWishlistCache();
  }, "Không thể xóa khỏi danh sách yêu thích");
}

export async function toggleWishlist(
  userId: string,
  productId: string
): AsyncResult<{ added: boolean }> {
  try {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    // Already in wishlist → Remove
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      revalidateWishlistCache();
      return ok({ added: false });
    }

    // Not in wishlist → Add (with validation)
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true },
    });
    if (!product) return err("Sản phẩm không tồn tại hoặc đã ngừng bán");

    await prisma.wishlist.create({ data: { userId, productId } });
    revalidateWishlistCache();
    return ok({ added: true });
  } catch (error) {
    logger.error("toggleWishlist error:", error);
    return err("Không thể cập nhật danh sách yêu thích");
  }
}

export async function clearWishlist(userId: string): AsyncVoidResult {
  return tryCatch(async () => {
    await prisma.wishlist.deleteMany({ where: { userId } });
    revalidateWishlistCache();
  }, "Không thể xóa danh sách yêu thích");
}
