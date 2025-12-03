/**
 * Review Types
 *
 * Tận dụng Prisma generated types cho base models.
 */

import type { ReviewModel, ReviewStatus } from "@/generated/prisma";

// ============================================
// Base Types (từ Prisma Generated)
// ============================================

/**
 * Base Review type từ database
 */
export type Review = ReviewModel;

// Re-export ReviewStatus for convenience
export type { ReviewStatus };

// ============================================
// Derived Types (cho specific use cases)
// ============================================

/**
 * Review hiển thị trên trang sản phẩm
 */
export interface ReviewListItem {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  isVerifiedPurchase: boolean;
  vendorReply: string | null;
  vendorReplyAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

/**
 * Thống kê review của sản phẩm
 */
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Review input từ user
 */
export interface ReviewFormInput {
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}
