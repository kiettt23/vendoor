import { z } from "zod";

// Review Schemas

/**
 * Schema cho tạo review
 */
export const createReviewSchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không hợp lệ"),
  rating: z
    .number()
    .int()
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),
  title: z.string().max(100, "Tiêu đề tối đa 100 ký tự").optional(),
  content: z.string().max(2000, "Nội dung tối đa 2000 ký tự").optional(),
  images: z
    .array(z.string().url("URL hình ảnh không hợp lệ"))
    .max(5, "Tối đa 5 hình ảnh")
    .optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

/**
 * Schema cho vendor reply
 */
export const vendorReplySchema = z.object({
  reviewId: z.string().min(1, "ID review không hợp lệ"),
  reply: z
    .string()
    .min(1, "Nội dung phản hồi không được để trống")
    .max(1000, "Phản hồi tối đa 1000 ký tự"),
});

export type VendorReplyInput = z.infer<typeof vendorReplySchema>;
