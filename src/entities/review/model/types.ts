import type { ReviewStatus } from "@/generated/prisma/client/enums";

// ============================================
// Review Types
// ============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string | null;
  orderItemId: string | null;
  rating: number;
  title: string | null;
  content: string | null;
  images: string[];
  isVerifiedPurchase: boolean;
  vendorReply: string | null;
  vendorReplyAt: Date | null;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

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
