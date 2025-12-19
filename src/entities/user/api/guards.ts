"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { ROUTES } from "@/shared/lib/constants";
import { requireSession, getSession } from "@/shared/lib/auth/session";
import type { UserRole, AuthResult } from "../model/types";

/**
 * Yêu cầu user đã đăng nhập.
 * Redirect về login nếu chưa.
 *
 * @returns Session và user info
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
 * Redirect về home nếu không có quyền.
 *
 * @param role - Role cần kiểm tra
 */
export async function requireRole(role: UserRole): Promise<AuthResult> {
  const { session, user } = await requireAuth();

  if (!user.roles.includes(role)) {
    redirect(ROUTES.HOME);
  }

  return { session, user };
}

/**
 * Yêu cầu user là ADMIN.
 * Shortcut cho requireRole("ADMIN").
 */
export async function requireAdmin(): Promise<AuthResult> {
  return requireRole("ADMIN");
}

/**
 * Kiểm tra user có role cụ thể hay không.
 * Không redirect, chỉ trả về boolean.
 *
 * @param role - Role cần kiểm tra
 * @returns true nếu user có role
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
