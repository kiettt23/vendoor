import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ").length(10),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự").max(200),
  ward: z.string().min(2, "Phường/Xã là bắt buộc").max(50),
  district: z.string().min(2, "Quận/Huyện là bắt buộc").max(50),
  city: z.string().min(2, "Tỉnh/Thành phố là bắt buộc").max(50),
  note: z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

