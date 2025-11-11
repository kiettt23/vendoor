import { z } from "zod";

// Rating validation schema
export const ratingSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  rating: z
    .number()
    .min(1, "Vui lòng chọn số sao")
    .max(5, "Rating must be between 1 and 5"),
  review: z.string().min(1, "Vui lòng viết đánh giá của bạn"),
});

export type RatingFormData = z.infer<typeof ratingSchema>;
