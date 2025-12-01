"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";

// ============================================
// Wishlist Actions
// ============================================

/**
 * Thêm sản phẩm vào wishlist
 */
export async function addToWishlist(
  userId: string,
  productId: string
): Promise<Result<string>> {
  try {
    // 1. Kiểm tra sản phẩm tồn tại và active
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true },
    });

    if (!product) {
      return err("Sản phẩm không tồn tại hoặc đã ngừng bán");
    }

    // 2. Kiểm tra đã có trong wishlist chưa
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return err("Sản phẩm đã có trong danh sách yêu thích");
    }

    // 3. Thêm vào wishlist
    const item = await prisma.wishlist.create({
      data: { userId, productId },
    });

    // 4. Revalidate cache
    revalidatePath("/wishlist");

    return ok(item.id);
  } catch (error) {
    console.error("addToWishlist error:", error);
    return err("Không thể thêm vào danh sách yêu thích");
  }
}

/**
 * Xóa sản phẩm khỏi wishlist
 */
export async function removeFromWishlist(
  userId: string,
  productId: string
): Promise<Result<void>> {
  try {
    await prisma.wishlist.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    // Revalidate cache
    revalidatePath("/wishlist");

    return ok(undefined);
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return err("Không thể xóa khỏi danh sách yêu thích");
  }
}

/**
 * Toggle wishlist (thêm nếu chưa có, xóa nếu đã có)
 */
export async function toggleWishlist(
  userId: string,
  productId: string
): Promise<Result<{ added: boolean }>> {
  try {
    // 1. Kiểm tra đã có trong wishlist chưa
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      // Xóa khỏi wishlist
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });

      revalidatePath("/wishlist");
      return ok({ added: false });
    } else {
      // Kiểm tra sản phẩm tồn tại
      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
        select: { id: true },
      });

      if (!product) {
        return err("Sản phẩm không tồn tại hoặc đã ngừng bán");
      }

      // Thêm vào wishlist
      await prisma.wishlist.create({
        data: { userId, productId },
      });

      revalidatePath("/wishlist");
      return ok({ added: true });
    }
  } catch (error) {
    console.error("toggleWishlist error:", error);
    return err("Không thể cập nhật danh sách yêu thích");
  }
}

/**
 * Xóa toàn bộ wishlist của user
 */
export async function clearWishlist(userId: string): Promise<Result<void>> {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId },
    });

    revalidatePath("/wishlist");
    return ok(undefined);
  } catch (error) {
    console.error("clearWishlist error:", error);
    return err("Không thể xóa danh sách yêu thích");
  }
}
