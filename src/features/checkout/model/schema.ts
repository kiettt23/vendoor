import { z } from "zod";

export const paymentMethods = ["COD", "STRIPE"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const checkoutSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),
  phone: z
    .string()
    .length(10, "Số điện thoại phải có đúng 10 số")
    .regex(/^0\d{9}$/, "Số điện thoại phải bắt đầu bằng số 0 (VD: 0912345678)"),
  email: z.string().email("Email không hợp lệ (VD: example@gmail.com)"),
  address: z
    .string()
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự"),
  ward: z
    .string()
    .min(2, "Vui lòng nhập Phường/Xã")
    .max(50, "Phường/Xã không được quá 50 ký tự"),
  district: z
    .string()
    .min(2, "Vui lòng nhập Quận/Huyện")
    .max(50, "Quận/Huyện không được quá 50 ký tự"),
  city: z
    .string()
    .min(2, "Vui lòng nhập Tỉnh/Thành phố")
    .max(50, "Tỉnh/Thành phố không được quá 50 ký tự"),
  note: z.string().max(500, "Ghi chú không được quá 500 ký tự").optional(),
  paymentMethod: z.enum(paymentMethods).describe("Phương thức thanh toán"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export interface InvalidCartItem {
  variantId: string;
  productName: string;
  variantName: string | null;
  requestedQuantity: number;
  availableStock: number;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  invalidItems: InvalidCartItem[];
}
