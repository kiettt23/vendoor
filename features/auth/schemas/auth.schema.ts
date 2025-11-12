import { z } from "zod";

/**
 * Auth Validation Schemas
 */

export const signInSchema = z.object({
  username: z
    .string()
    .min(3, "Username tối thiểu 3 ký tự")
    .max(30, "Username tối đa 30 ký tự"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  username: z
    .string()
    .min(3, "Username tối thiểu 3 ký tự")
    .max(30, "Username tối đa 30 ký tự"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Tên không được để trống").optional(),
  username: z
    .string()
    .min(3, "Username tối thiểu 3 ký tự")
    .max(30, "Username tối đa 30 ký tự")
    .optional(),
  image: z.string().url("URL không hợp lệ").optional(),
});

/**
 * Inferred Types
 */
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
