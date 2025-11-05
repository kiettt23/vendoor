import { z } from "zod";

/**
 * Validation schema cho Address
 * Dùng chung cho: address modal, checkout, profile
 */
export const addressSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  street: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  state: z.string().min(1, "Vui lòng nhập quận/huyện"),
  zip: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  country: z.string().min(1, "Vui lòng nhập quốc gia"),
});

export type AddressFormData = z.infer<typeof addressSchema>;
