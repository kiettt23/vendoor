import type { ReviewModel, ReviewStatus } from "@/generated/prisma";

export type { ReviewStatus };
export type Review = ReviewModel;

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

export interface ReviewFormInput {
  productId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}
