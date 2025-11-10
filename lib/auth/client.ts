import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client - Sử dụng trong client components
 * Tự động detect baseURL từ window.location
 */
export const authClient = createAuthClient();

/**
 * Exports cho client components:
 * - useSession: Hook để lấy session hiện tại
 * - signIn: Hàm đăng nhập
 * - signUp: Hàm đăng ký
 * - signOut: Hàm đăng xuất
 */
export const { useSession, signIn, signUp, signOut } = authClient;
