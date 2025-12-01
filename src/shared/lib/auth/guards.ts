/**
 * Auth Guards - Role-based Access Control
 *
 * Server-side utilities để kiểm tra authentication và authorization.
 * Giúp tránh code lặp lại ở các protected pages.
 *
 * @example
 * // Trong Server Component
 * const { session, user } = await requireAuth();
 *
 * // Yêu cầu role cụ thể
 * const { session, user } = await requireRole("VENDOR");
 */

"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "./config";
import { prisma } from "@/shared/lib/db";
import { ROUTES } from "@/shared/lib/constants";

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface AuthResult {
  session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>;
  user: {
    id: string;
    roles: UserRole[];
    name?: string | null;
    email?: string | null;
  };
}

/**
 * Yêu cầu user đã đăng nhập.
 * Redirect về /login nếu chưa đăng nhập.
 *
 * @returns Session và thông tin user cơ bản
 * @throws Redirect to /login if not authenticated
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      roles: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  return {
    session,
    user: user as AuthResult["user"],
  };
}

/**
 * Yêu cầu user có role cụ thể.
 * Redirect về homepage nếu không có quyền.
 *
 * @param role - Role cần kiểm tra
 * @returns Session và thông tin user
 * @throws Redirect to /login if not authenticated
 * @throws Redirect to / if role not matched
 */
export async function requireRole(role: UserRole): Promise<AuthResult> {
  const { session, user } = await requireAuth();

  if (!user.roles.includes(role)) {
    redirect(ROUTES.HOME);
  }

  return { session, user };
}

/**
 * Yêu cầu user là Vendor và trả về vendor profile.
 *
 * @returns Session, user và vendor profile
 * @throws Redirect to /login if not authenticated
 * @throws Redirect to / if not a vendor
 */
export async function requireVendor() {
  const { session, user } = await requireRole("VENDOR");

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      shopName: true,
      status: true,
    },
  });

  if (!vendorProfile) {
    redirect(ROUTES.HOME);
  }

  return { session, user, vendorProfile };
}

/**
 * Yêu cầu user là Admin.
 *
 * @returns Session và user
 * @throws Redirect to /login if not authenticated
 * @throws Redirect to / if not admin
 */
export async function requireAdmin() {
  return requireRole("ADMIN");
}

/**
 * Lấy session hiện tại (không redirect).
 * Dùng cho các trang public cần check trạng thái login.
 *
 * @returns Session hoặc null
 */
export async function getAuthSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Kiểm tra user có role cụ thể không (không redirect).
 *
 * @param role - Role cần kiểm tra
 * @returns true nếu có role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getAuthSession();
  if (!session?.user) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  return user?.roles.includes(role) ?? false;
}
