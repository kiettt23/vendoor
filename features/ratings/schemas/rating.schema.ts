import { z } from "zod";

/**
 * Rating Validation Schema
 */

export const ratingSchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không được để trống"),
  orderId: z.string().min(1, "ID đơn hàng không được để trống"),
  rating: z
    .number()
    .min(1, "Vui lòng chọn số sao")
    .max(5, "Đánh giá từ 1 đến 5 sao"),
  review: z.string().min(1, "Vui lòng viết đánh giá của bạn"),
});

/**
 * Inferred Types
 */
export type RatingFormData = z.infer<typeof ratingSchema>;
