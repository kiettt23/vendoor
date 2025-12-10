"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { ok, err, type Result, createLogger } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/constants";

const logger = createLogger("wishlist");

export async function addToWishlist(
  userId: string,
  productId: string
): Promise<Result<string>> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { id: true },
    });

    if (!product) {
      return err("Sản phẩm không tồn tại hoặc đã ngừng bán");
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return err("Sản phẩm đã có trong danh sách yêu thích");
    }

    const item = await prisma.wishlist.create({
      data: { userId, productId },
    });

    revalidatePath(ROUTES.WISHLIST);

    return ok(item.id);
  } catch (error) {
    logger.error("addToWishlist error:", error);
    return err("Không thể thêm vào danh sách yêu thích");
  }
}

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

    revalidatePath(ROUTES.WISHLIST);

    return ok(undefined);
  } catch (error) {
    logger.error("removeFromWishlist error:", error);
    return err("Không thể xóa khỏi danh sách yêu thích");
  }
}

export async function toggleWishlist(
  userId: string,
  productId: string
): Promise<Result<{ added: boolean }>> {
  try {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });

      revalidatePath(ROUTES.WISHLIST);
      return ok({ added: false });
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId, isActive: true },
        select: { id: true },
      });

      if (!product) {
        return err("Sản phẩm không tồn tại hoặc đã ngừng bán");
      }

      await prisma.wishlist.create({
        data: { userId, productId },
      });

      revalidatePath(ROUTES.WISHLIST);
      return ok({ added: true });
    }
  } catch (error) {
    logger.error("toggleWishlist error:", error);
    return err("Không thể cập nhật danh sách yêu thích");
  }
}

export async function clearWishlist(userId: string): Promise<Result<void>> {
  try {
    await prisma.wishlist.deleteMany({
      where: { userId },
    });

    revalidatePath(ROUTES.WISHLIST);
    return ok(undefined);
  } catch (error) {
    logger.error("clearWishlist error:", error);
    return err("Không thể xóa danh sách yêu thích");
  }
}
