export type {
  Review,
  ReviewListItem,
  ReviewStats,
  ReviewFormInput,
} from "./model";

export {
  createReviewSchema,
  vendorReplySchema,
  type CreateReviewInput,
  type VendorReplyInput,
} from "./model";

/**
 * ⚠️ Review API Exports
 *
 * - Actions: Available here (callable from Client Components)
 * - Queries (getProductReviews, etc.): Import directly from
 *   "@/entities/review/api/queries" in Server Components only
 */
export {
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
  deleteVendorReply,
} from "./api";

export {
  StarRating,
  StarRatingInput,
  ReviewCard,
  ReviewStatsSummary,
} from "./ui";
