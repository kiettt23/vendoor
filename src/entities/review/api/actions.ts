"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";

import { createReviewSchema, vendorReplySchema } from "../model";
import type { CreateReviewInput, VendorReplyInput } from "../model";

// ============================================
// Review Actions
// ============================================

/**
 * Tạo review cho sản phẩm
 */
export async function createReview(
  userId: string,
  data: CreateReviewInput
): Promise<Result<string>> {
  try {
    // 1. Validate input
    const validated = createReviewSchema.parse(data);

    // 2. Kiểm tra đã review chưa
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId: validated.productId },
      },
    });

    if (existingReview) {
      return err("Bạn đã đánh giá sản phẩm này rồi");
    }

    // 3. Kiểm tra có phải verified purchase không
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

    // 4. Tạo review
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

    // 5. Revalidate cache
    revalidatePath(`/products`);

    return ok(review.id);
  } catch (error) {
    console.error("createReview error:", error);
    return err("Không thể tạo đánh giá");
  }
}

/**
 * Cập nhật review
 */
export async function updateReview(
  userId: string,
  reviewId: string,
  data: Omit<CreateReviewInput, "productId">
): Promise<Result<void>> {
  try {
    // 1. Kiểm tra review thuộc về user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    });

    if (!review || review.userId !== userId) {
      return err("Không tìm thấy đánh giá");
    }

    // 2. Update review
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        title: data.title || null,
        content: data.content || null,
        images: data.images || [],
      },
    });

    // 3. Revalidate cache
    revalidatePath(`/products`);

    return ok(undefined);
  } catch (error) {
    console.error("updateReview error:", error);
    return err("Không thể cập nhật đánh giá");
  }
}

/**
 * Xóa review
 */
export async function deleteReview(
  userId: string,
  reviewId: string
): Promise<Result<void>> {
  try {
    // 1. Kiểm tra review thuộc về user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true },
    });

    if (!review || review.userId !== userId) {
      return err("Không tìm thấy đánh giá");
    }

    // 2. Xóa review
    await prisma.review.delete({ where: { id: reviewId } });

    // 3. Revalidate cache
    revalidatePath(`/products`);

    return ok(undefined);
  } catch (error) {
    console.error("deleteReview error:", error);
    return err("Không thể xóa đánh giá");
  }
}

/**
 * Vendor phản hồi review
 */
export async function replyToReview(
  vendorUserId: string,
  data: VendorReplyInput
): Promise<Result<void>> {
  try {
    // 1. Validate input
    const validated = vendorReplySchema.parse(data);

    // 2. Kiểm tra review thuộc về sản phẩm của vendor
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

    // 3. Update reply
    await prisma.review.update({
      where: { id: validated.reviewId },
      data: {
        vendorReply: validated.reply,
        vendorReplyAt: new Date(),
      },
    });

    // 4. Revalidate cache
    revalidatePath(`/products`);
    revalidatePath(`/vendor/reviews`);

    return ok(undefined);
  } catch (error) {
    console.error("replyToReview error:", error);
    return err("Không thể gửi phản hồi");
  }
}

/**
 * Xóa reply của vendor
 */
export async function deleteVendorReply(
  vendorUserId: string,
  reviewId: string
): Promise<Result<void>> {
  try {
    // 1. Kiểm tra review thuộc về sản phẩm của vendor
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

    // 2. Xóa reply
    await prisma.review.update({
      where: { id: reviewId },
      data: {
        vendorReply: null,
        vendorReplyAt: null,
      },
    });

    // 3. Revalidate cache
    revalidatePath(`/products`);
    revalidatePath(`/vendor/reviews`);

    return ok(undefined);
  } catch (error) {
    console.error("deleteVendorReply error:", error);
    return err("Không thể xóa phản hồi");
  }
}
