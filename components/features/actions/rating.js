"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitRating(ratingData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    const { productId, orderId, rating, review } = ratingData;

    // Validate
    if (!productId || !orderId) {
      throw new Error("Thiếu thông tin sản phẩm hoặc đơn hàng");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Vui lòng chọn số sao đánh giá");
    }

    if (review.length < 5) {
      throw new Error("Vui lòng viết nhận xét ngắn");
    }

    // Check if already rated
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId,
        productId,
        orderId,
      },
    });

    if (existingRating) {
      throw new Error("Bạn đã đánh giá sản phẩm này rồi");
    }

    // Create rating
    const newRating = await prisma.rating.create({
      data: {
        rating,
        review,
        userId,
        productId,
        orderId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath(`/product/${productId}`);

    return {
      success: true,
      message: "Cảm ơn bạn đã đánh giá!",
      rating: newRating,
    };
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể gửi đánh giá"
    );
  }
}
