import { z } from "zod";

import { REGEX_PATTERNS } from "@/shared/lib/constants";

export const vendorRegistrationSchema = z.object({
  shopName: z
    .string()
    .min(3, "Tên shop phải có ít nhất 3 ký tự")
    .max(50, "Tên shop tối đa 50 ký tự"),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
  businessAddress: z
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(200, "Địa chỉ tối đa 200 ký tự")
    .optional(),
  businessPhone: z
    .string()
    .regex(REGEX_PATTERNS.PHONE_VN, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  businessEmail: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export type VendorRegistrationInput = z.infer<typeof vendorRegistrationSchema>;
