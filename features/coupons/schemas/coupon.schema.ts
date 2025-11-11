import { z } from "zod";

/**
 * Validation schema cho Coupon
 * Dùng chung cho: admin create coupon, edit coupon
 */
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Mã giảm giá phải có ít nhất 3 ký tự")
    .regex(/^[A-Z0-9]+$/, "Mã chỉ chứa chữ in hoa và số"),
  description: z.string().min(5, "Mô tả phải có ít nhất 5 ký tự"),
  discount: z
    .number()
    .min(1, "Giảm giá phải lớn hơn 0")
    .max(100, "Giảm giá tối đa 100%"),
  expiresAt: z.date(),
  isPublic: z.boolean(),
  forNewUser: z.boolean(),
  forMember: z.boolean(),
  minOrderValue: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu không được âm")
    .optional(),
});

export type CouponFormData = z.infer<typeof couponSchema>;
