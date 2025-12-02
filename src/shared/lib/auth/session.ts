/**
 * Session Utilities - Pure Primitives
 *
 * Server-side session helpers không có business logic.
 * Chỉ làm việc với Better Auth session, không query database.
 *
 * @example
 * const session = await getSession();
 * if (!session) redirect("/login");
 */

"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./config";
import { ROUTES } from "@/shared/lib/constants";

export type { Session } from "./config";

/**
 * Lấy session hiện tại (không redirect).
 * Dùng cho các trang public cần check trạng thái login.
 *
 * @returns Session hoặc null
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Yêu cầu session hợp lệ - redirect nếu chưa login.
 * Đây là primitive - chỉ check session, không query user data.
 *
 * @returns Session object từ Better Auth
 * @throws Redirect to /login if not authenticated
 */
export async function requireSession() {
  const session = await getSession();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return session;
}
