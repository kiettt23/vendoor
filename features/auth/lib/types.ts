import { z } from "zod";

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

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type UserRole = "USER" | "SELLER" | "ADMIN";

export type StoreStatus = "pending" | "approved" | "rejected";

export type AuthUser = {
  id: string;
  email?: string;
  username?: string;
  role?: string;
  name?: string;
  image?: string;
} | null;

export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string | null;
  status: StoreStatus;
  isActive: boolean;
}

export interface SellerStoreResult {
  isSeller: boolean;
  storeInfo: StoreInfo | null;
}

export interface SellerWithStore {
  user: NonNullable<AuthUser>;
  storeId: string;
  storeInfo: StoreInfo;
}

export interface DeviceSession {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    username?: string;
  };
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
