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

export async function requireRole(role: UserRole): Promise<AuthResult> {
  const { session, user } = await requireAuth();

  if (!user.roles.includes(role)) {
    redirect(ROUTES.HOME);
  }

  return { session, user };
}

export async function requireAdmin() {
  return requireRole("ADMIN");
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession();
  if (!session?.user) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  return user?.roles.includes(role) ?? false;
}
