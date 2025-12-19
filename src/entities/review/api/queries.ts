import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import type { ReviewListItem, ReviewStats } from "../model";

// ============================================================================
// Product Reviews
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - NO cross-request cache for review queries
//
// Why NO cross-request cache?
// - Reviews need to appear immediately after approval (fresh data required)
// - Product review stats change with each new review
// - User experience: customers expect to see their review right after posting
// - Vendor replies need to show up instantly
// - Request-level cache() is sufficient for preventing duplicate queries in same render

export const getProductReviews = cache(
  async (
    productId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ reviews: ReviewListItem[]; total: number }> => {
    const { page = 1, limit = 10 } = options;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { productId, status: "APPROVED" },
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
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: { productId, status: "APPROVED" } }),
    ]);

    return { reviews, total };
  }
);

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

// ============================================================================
// User Review Checks
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - Used for permission checks (can user review this product?)
// - cache() prevents duplicate queries during same page render
// - No cross-request cache needed (user state can change between requests)

export const hasUserReviewed = cache(
  async (userId: string, productId: string): Promise<boolean> => {
    const review = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true },
    });
    return !!review;
  }
);

export const hasUserPurchased = cache(
  async (userId: string, productId: string): Promise<boolean> => {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        variant: { productId },
        order: { customerId: userId, status: "DELIVERED" },
      },
      select: { id: true },
    });
    return !!orderItem;
  }
);

export const getUserReview = cache(
  async (userId: string, productId: string) => {
    return prisma.review.findUnique({
      where: { userId_productId: { userId, productId } },
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

// ============================================================================
// Vendor Reviews
// ============================================================================
//
// Caching Strategy: Request-level deduplication ONLY (React cache)
// - Vendor dashboard review list (all reviews for vendor's products)
// - Vendors need to see new reviews and replies in real-time
// - No cross-request cache - vendor-specific and frequently changing

export const getVendorReviews = cache(
  async (
    vendorProfileId: string,
    options: { page?: number; limit?: number } = {}
  ) => {
    const { page = 1, limit = 10 } = options;

    const whereClause = {
      product: { vendor: { vendorProfile: { id: vendorProfileId } } },
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
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
          user: { select: { id: true, name: true, image: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where: whereClause }),
    ]);

    return { reviews, total };
  }
);
