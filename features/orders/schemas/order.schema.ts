import { z } from "zod";

/**
 * Order Validation Schemas
 */

export const orderItemSchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không được để trống"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
  price: z.number().min(0, "Giá không hợp lệ"),
  name: z.string().optional(),
});

export const orderSchema = z.object({
  addressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng"),
  items: z.array(orderItemSchema).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
  paymentMethod: z.enum(["COD", "STRIPE"]),
  couponCode: z.string().optional(),
});

export const couponCodeSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã giảm giá"),
});

/**
 * Inferred Types
 */
export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type CouponCodeFormData = z.infer<typeof couponCodeSchema>;
