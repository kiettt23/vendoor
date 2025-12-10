"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result, createLogger } from "@/shared/lib/utils";
import { ROUTES, REVALIDATION_PATHS } from "@/shared/lib/constants";

import { createReviewSchema, vendorReplySchema } from "../model";
import type { CreateReviewInput, VendorReplyInput } from "../model";

const logger = createLogger("review");

export async function createReview(
  userId: string,
  data: CreateReviewInput
): Promise<Result<string>> {
  try {
    const validated = createReviewSchema.parse(data);

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: validated.productId },
      },
    });

    if (existingReview) {
      return err("Bạn đã đánh giá sản phẩm này rồi");
    }

    const orderItem = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId: validated.productId,
        },
        order: {
          customerId: userId,
          status: "DELIVERED",
        },
      },
      select: { id: true, orderId: true },
    });

    const review = await prisma.review.create({
      data: {
        userId,
        productId: validated.productId,
        rating: validated.rating,
        title: validated.title || null,
        content: validated.content || null,
        images: validated.images || [],
        isVerifiedPurchase: !!orderItem,
        orderId: orderItem?.orderId || null,
        orderItemId: orderItem?.id || null,
        status: "APPROVED", // Auto-approve cho MVP
      },
    });

    revalidatePath(ROUTES.PRODUCTS);

    return ok(review.id);
  } catch (error) {
    logger.error("createReview error:", error);
    return err("Không thể tạo đánh giá");
  }
}

export async function updateReview(
  userId: string,
  reviewId: string,
  data: Omit<CreateReviewInput, "productId">
): Promise<Result<void>> {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    });

    if (!review || review.userId !== userId) {
      return err("Không tìm thấy đánh giá");
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        title: data.title || null,
        content: data.content || null,
        images: data.images || [],
      },
    });

    revalidatePath(ROUTES.PRODUCTS);

    return ok(undefined);
  } catch (error) {
    logger.error("updateReview error:", error);
    return err("Không thể cập nhật đánh giá");
  }
}

export async function deleteReview(
  userId: string,
  reviewId: string
): Promise<Result<void>> {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review || review.userId !== userId) {
      return err("Không tìm thấy đánh giá");
    }

    await prisma.review.delete({ where: { id: reviewId } });

    revalidatePath(ROUTES.PRODUCTS);

    return ok(undefined);
  } catch (error) {
    logger.error("deleteReview error:", error);
    return err("Không thể xóa đánh giá");
  }
}

export async function replyToReview(
  vendorUserId: string,
  data: VendorReplyInput
): Promise<Result<void>> {
  try {
    const validated = vendorReplySchema.parse(data);

    const review = await prisma.review.findUnique({
      where: { id: validated.reviewId },
      select: {
        id: true,
        product: {
          select: { vendorId: true },
        },
      },
    });

    if (!review || review.product.vendorId !== vendorUserId) {
      return err("Không tìm thấy đánh giá");
    }

    await prisma.review.update({
      where: { id: validated.reviewId },
      data: {
        vendorReply: validated.reply,
        vendorReplyAt: new Date(),
      },
    });

    REVALIDATION_PATHS.REVIEWS.forEach(p => revalidatePath(p));

    return ok(undefined);
  } catch (error) {
    logger.error("replyToReview error:", error);
    return err("Không thể gửi phản hồi");
  }
}

export async function deleteVendorReply(
  vendorUserId: string,
  reviewId: string
): Promise<Result<void>> {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        product: {
          select: { vendorId: true },
        },
      },
    });

    if (!review || review.product.vendorId !== vendorUserId) {
      return err("Không tìm thấy đánh giá");
    }

    await prisma.review.update({
      where: { id: reviewId },
      data: {
        vendorReply: null,
        vendorReplyAt: null,
      },
    });

    REVALIDATION_PATHS.REVIEWS.forEach(p => revalidatePath(p));

    return ok(undefined);
  } catch (error) {
    logger.error("deleteVendorReply error:", error);
    return err("Không thể xóa phản hồi");
  }
}
