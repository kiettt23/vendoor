"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import {
  ok,
  err,
  type AsyncResult,
  type AsyncVoidResult,
  createLogger,
} from "@/shared/lib/utils";
import { ROUTES, REVALIDATION_PATHS, CACHE_TAGS } from "@/shared/lib/constants";
import { createReviewSchema, vendorReplySchema } from "../model";
import type { CreateReviewInput, VendorReplyInput } from "../model";

const logger = createLogger("review");

// ============================================================================
// Helpers
// ============================================================================

function revalidateReviewCache(productId: string) {
  revalidateTag(CACHE_TAGS.REVIEWS, "max");
  revalidateTag(CACHE_TAGS.REVIEWS_BY_PRODUCT(productId), "max");
  revalidateTag(CACHE_TAGS.PRODUCTS, "max");
  revalidatePath(ROUTES.PRODUCTS);
}

function revalidateReviewPaths() {
  REVALIDATION_PATHS.REVIEWS.forEach((p) => revalidatePath(p));
}

// ============================================================================
// Customer Actions
// ============================================================================

export async function createReview(
  userId: string,
  data: CreateReviewInput
): AsyncResult<string> {
  try {
    const validated = createReviewSchema.parse(data);

    // Guard: Already reviewed
    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: validated.productId } },
    });
    if (existingReview) return err("Bạn đã đánh giá sản phẩm này rồi");

    // Check verified purchase
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        variant: { productId: validated.productId },
        order: { customerId: userId, status: "DELIVERED" },
      },
      select: { id: true, orderId: true },
    });

    // Create
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
        status: "APPROVED",
      },
    });

    revalidateReviewCache(validated.productId);
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
): AsyncVoidResult {
  try {
    // Guard: Check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    });
    if (!review || review.userId !== userId)
      return err("Không tìm thấy đánh giá");

    // Update
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        title: data.title || null,
        content: data.content || null,
        images: data.images || [],
      },
    });

    revalidateReviewCache(review.productId);
    return ok(undefined);
  } catch (error) {
    logger.error("updateReview error:", error);
    return err("Không thể cập nhật đánh giá");
  }
}

export async function deleteReview(
  userId: string,
  reviewId: string
): AsyncVoidResult {
  try {
    // Guard: Check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    });
    if (!review || review.userId !== userId)
      return err("Không tìm thấy đánh giá");

    // Delete
    await prisma.review.delete({ where: { id: reviewId } });

    revalidateReviewCache(review.productId);
    return ok(undefined);
  } catch (error) {
    logger.error("deleteReview error:", error);
    return err("Không thể xóa đánh giá");
  }
}

// ============================================================================
// Vendor Actions
// ============================================================================

export async function replyToReview(
  vendorUserId: string,
  data: VendorReplyInput
): AsyncVoidResult {
  try {
    const validated = vendorReplySchema.parse(data);

    // Guard: Check vendor ownership
    const review = await prisma.review.findUnique({
      where: { id: validated.reviewId },
      select: { id: true, product: { select: { vendorId: true } } },
    });
    if (!review || review.product.vendorId !== vendorUserId) {
      return err("Không tìm thấy đánh giá");
    }

    // Update
    await prisma.review.update({
      where: { id: validated.reviewId },
      data: { vendorReply: validated.reply, vendorReplyAt: new Date() },
    });

    revalidateReviewPaths();
    return ok(undefined);
  } catch (error) {
    logger.error("replyToReview error:", error);
    return err("Không thể gửi phản hồi");
  }
}

export async function deleteVendorReply(
  vendorUserId: string,
  reviewId: string
): AsyncVoidResult {
  try {
    // Guard: Check vendor ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, product: { select: { vendorId: true } } },
    });
    if (!review || review.product.vendorId !== vendorUserId) {
      return err("Không tìm thấy đánh giá");
    }

    // Clear reply
    await prisma.review.update({
      where: { id: reviewId },
      data: { vendorReply: null, vendorReplyAt: null },
    });

    revalidateReviewPaths();
    return ok(undefined);
  } catch (error) {
    logger.error("deleteVendorReply error:", error);
    return err("Không thể xóa phản hồi");
  }
}
