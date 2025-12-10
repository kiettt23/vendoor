/**
 * Review API - Barrel Export
 *
 * ⚠️ Queries được export riêng để tránh leak server-code vào client.
 *
 * Client Components: import từ đây (actions only)
 * Server Components: import queries từ "@/entities/review/api/queries"
 */
export {
  createReview,
  updateReview,
  deleteReview,
  replyToReview,
  deleteVendorReply,
} from "./actions";
