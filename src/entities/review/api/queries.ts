import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import type { ReviewListItem, ReviewStats } from "../model";

// ============================================
// Review Queries
// ============================================

/**
 * Lấy danh sách reviews của sản phẩm
 */
export const getProductReviews = cache(
  async (
    productId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ reviews: ReviewListItem[]; total: number }> => {
    const { page = 1, limit = 10 } = options;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId,
          status: "APPROVED",
        },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          images: true,
          isVerifiedPurchase: true,
          vendorReply: true,
          vendorReplyAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({
        where: { productId, status: "APPROVED" },
      }),
    ]);

    return { reviews, total };
  }
);

/**
 * Lấy thống kê reviews của sản phẩm
 */
export const getProductReviewStats = cache(
  async (productId: string): Promise<ReviewStats> => {
    const reviews = await prisma.review.findMany({
      where: { productId, status: "APPROVED" },
      select: { rating: true },
    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    for (const review of reviews) {
      totalRating += review.rating;
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
    }

    return {
      averageRating: Math.round((totalRating / totalReviews) * 10) / 10,
      totalReviews,
      ratingDistribution,
    };
  }
);

/**
 * Kiểm tra user đã review sản phẩm chưa
 */
export const hasUserReviewed = cache(
  async (userId: string, productId: string): Promise<boolean> => {
    const review = await prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { id: true },
    });

    return !!review;
  }
);

/**
 * Kiểm tra user đã mua sản phẩm chưa (verified purchase)
 */
export const hasUserPurchased = cache(
  async (userId: string, productId: string): Promise<boolean> => {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        variant: {
          productId,
        },
        order: {
          customerId: userId,
          status: "DELIVERED", // Chỉ count đơn đã giao thành công
        },
      },
      select: { id: true },
    });

    return !!orderItem;
  }
);

/**
 * Lấy reviews của vendor (cho vendor dashboard)
 */
export const getVendorReviews = cache(
  async (
    vendorProfileId: string,
    options: { page?: number; limit?: number } = {}
  ) => {
    const { page = 1, limit = 10 } = options;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          product: {
            vendor: {
              vendorProfile: {
                id: vendorProfileId,
              },
            },
          },
        },
        select: {
          id: true,
          rating: true,
          title: true,
          content: true,
          images: true,
          isVerifiedPurchase: true,
          vendorReply: true,
          vendorReplyAt: true,
          createdAt: true,
          status: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({
        where: {
          product: {
            vendor: {
              vendorProfile: {
                id: vendorProfileId,
              },
            },
          },
        },
      }),
    ]);

    return { reviews, total };
  }
);

/**
 * Lấy review của user cho 1 sản phẩm
 */
export const getUserReview = cache(
  async (userId: string, productId: string) => {
    return prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        images: true,
        createdAt: true,
      },
    });
  }
);
