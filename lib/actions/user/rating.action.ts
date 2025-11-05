"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Rating, RatingActionResponse, SerializedRating } from "@/types";
import { ratingSchema, type RatingFormData } from "@/lib/validations";

export async function getUserRatings(): Promise<{
  ratings: SerializedRating[];
}> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { ratings: [] };
    }

    const ratings = await prisma.rating.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Serialize for Redux - Convert Date → string
    const serializedRatings: SerializedRating[] = ratings.map((rating) => ({
      ...rating,
      createdAt: rating.createdAt.toISOString(),
      updatedAt: rating.updatedAt.toISOString(),
    }));

    return { ratings: serializedRatings };
  } catch (error) {
    console.error("Get ratings error:", error);
    return { ratings: [] };
  }
}

export async function submitRating(
  ratingData: RatingFormData
): Promise<RatingActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // ✅ Validate using Zod schema (Single Source of Truth)
    const validation = ratingSchema.safeParse(ratingData);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || "Dữ liệu không hợp lệ",
      };
    }

    const { productId, orderId, rating, review } = validation.data;

    // Check if already rated
    const existingRating = await prisma.rating.findFirst({
      where: {
        userId,
        productId,
        orderId,
      },
    });

    if (existingRating) {
      return { success: false, error: "Bạn đã đánh giá sản phẩm này rồi" };
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
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath(`/product/${productId}`);

    // Serialize for Redux
    const serializedRating = {
      ...newRating,
      createdAt: newRating.createdAt.toISOString(),
      updatedAt: newRating.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Cảm ơn bạn đã đánh giá!",
      rating: serializedRating,
    };
  } catch (error) {
    console.error("Error submitting rating:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể gửi đánh giá",
    };
  }
}

export async function updateRating(
  ratingId: string,
  updateData: {
    rating?: number;
    review?: string;
  }
): Promise<RatingActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    const { rating, review } = updateData;

    // Validate
    if (rating && (rating < 1 || rating > 5)) {
      return {
        success: false,
        error: "Vui lòng chọn số sao đánh giá hợp lệ (1-5)",
      };
    }

    if (review && review.length < 5) {
      return { success: false, error: "Nhận xét phải có ít nhất 5 ký tự" };
    }

    // Check ownership
    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating || existingRating.userId !== userId) {
      return {
        success: false,
        error: "Không tìm thấy đánh giá hoặc bạn không có quyền chỉnh sửa",
      };
    }

    // Update rating
    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        ...(rating && { rating }),
        ...(review && { review }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/orders");
    revalidatePath(`/product/${existingRating.productId}`);

    const serializedRating = {
      ...updatedRating,
      createdAt: updatedRating.createdAt.toISOString(),
      updatedAt: updatedRating.updatedAt.toISOString(),
    };

    return {
      success: true,
      message: "Đã cập nhật đánh giá thành công!",
      rating: serializedRating,
    };
  } catch (error) {
    console.error("Error updating rating:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể cập nhật đánh giá",
    };
  }
}

export async function deleteRating(
  ratingId: string
): Promise<RatingActionResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Vui lòng đăng nhập" };
    }

    // Check ownership
    const existingRating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating || existingRating.userId !== userId) {
      return {
        success: false,
        error: "Không tìm thấy đánh giá hoặc bạn không có quyền xóa",
      };
    }

    // Delete rating
    await prisma.rating.delete({
      where: { id: ratingId },
    });

    revalidatePath("/orders");
    revalidatePath(`/product/${existingRating.productId}`);

    return {
      success: true,
      message: "Đã xóa đánh giá thành công!",
      deletedId: ratingId,
    };
  } catch (error) {
    console.error("Error deleting rating:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa đánh giá",
    };
  }
}
