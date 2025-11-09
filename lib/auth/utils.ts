/**
 * Auth Utilities
 *
 * Safe functions that return null/boolean (no throw)
 * Use in components for conditional rendering
 */

import { headers } from "next/headers";
import { auth } from "./config";
import prisma from "@/lib/prisma";
import type { SellerCheckResult } from "./types";

// Get current session
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

// Get current user from session (or null)
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

// Check if user has specific role(s)
export function hasRole(user: any, roles: string | string[]): boolean {
  if (!user?.role) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

// Check if user is seller or admin
export function isSeller(user: any): boolean {
  return hasRole(user, ["SELLER", "ADMIN"]);
}

// Check if user is admin
export function isAdmin(user: any): boolean {
  return hasRole(user, "ADMIN");
}

// Check if user is seller with approved store
export async function checkIsSeller(): Promise<SellerCheckResult> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { isSeller: false, storeInfo: null };
    }

    const store = await prisma.store.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        username: true,
        logo: true,
        status: true,
        isActive: true,
      },
    });

    // Check if store exists and is approved & active
    if (!store || store.status !== "approved" || !store.isActive) {
      return { isSeller: false, storeInfo: null };
    }

    return { isSeller: true, storeInfo: store };
  } catch (error) {
    console.error("Error checking seller status:", error);
    return { isSeller: false, storeInfo: null };
  }
}

// Check if current user is admin
export async function checkIsAdmin(): Promise<{ isAdmin: boolean }> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return { isAdmin: false };
    }

    return { isAdmin: user.role === "ADMIN" };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false };
  }
}
