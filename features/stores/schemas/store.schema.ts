import { z } from "zod";

/**
 * Store Validation Schemas
 */

export const storeSchema = z.object({
  name: z.string().min(3, "Tên cửa hàng phải có ít nhất 3 ký tự"),
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username chỉ chứa chữ cái, số, dấu gạch ngang và gạch dưới"
    ),
  description: z.string().optional(),
  email: z.string().email("Email không hợp lệ"),
  contact: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  image: z.instanceof(File).optional(),
});

export const storeUpdateSchema = z.object({
  name: z.string().min(3, "Tên cửa hàng phải có ít nhất 3 ký tự"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  email: z.string().email("Email không hợp lệ"),
  contact: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});

/**
 * Inferred Types
 */
export type StoreFormData = z.infer<typeof storeSchema>;
export type StoreUpdateFormData = z.infer<typeof storeUpdateSchema>;
