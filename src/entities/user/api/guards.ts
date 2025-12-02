/**
 * User Auth Guards
 *
 * Server-side utilities để kiểm tra authentication và authorization.
 * Đây là business logic layer - queries Prisma để lấy user data.
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
import { prisma } from "@/shared/lib/db";
import { ROUTES } from "@/shared/lib/constants";
import { requireSession, getSession } from "@/shared/lib/auth/session";

export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface AuthResult {
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>;
  user: {
    id: string;
    roles: UserRole[];
    name?: string | null;
    email?: string | null;
  };
}

/**
 * Yêu cầu user đã đăng nhập và lấy user data từ DB.
 * Redirect về /login nếu chưa đăng nhập hoặc user không tồn tại.
 *
 * @returns Session và thông tin user cơ bản
 * @throws Redirect to /login if not authenticated
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await requireSession();

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
 * Kiểm tra user có role cụ thể không (không redirect).
 *
 * @param role - Role cần kiểm tra
 * @returns true nếu có role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession();
  if (!session?.user) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  return user?.roles.includes(role) ?? false;
}
