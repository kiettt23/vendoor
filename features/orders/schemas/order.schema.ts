import { z } from "zod";

// Order item schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
  name: z.string().optional(),
});

// Order validation schema
export const orderSchema = z.object({
  addressId: z.string().min(1, "Vui lòng chọn địa chỉ giao hàng"),
  items: z.array(orderItemSchema).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
  paymentMethod: z.enum(["COD", "STRIPE"]),
  couponCode: z.string().optional(),
});

// Coupon validation schema
export const couponCodeSchema = z.object({
  code: z.string().min(1, "Vui lòng nhập mã giảm giá"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
export type OrderItemFormData = z.infer<typeof orderItemSchema>;
export type CouponCodeFormData = z.infer<typeof couponCodeSchema>;
