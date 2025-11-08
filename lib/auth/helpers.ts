import { headers } from "next/headers";
import { auth } from "../auth";

/**
 * Server-side Auth Utilities
 *
 * Better Auth native approach - no unnecessary DB queries
 * Session already contains user data
 */

// Get current session
export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

// Get current user from session
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

// Check if user has specific role
function hasRole(user: any, roles: string | string[]): boolean {
  if (!user?.role) return false;

  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}

// Require authentication
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - Login required");
  }

  return user;
}

// Require admin role
export async function requireAdmin() {
  const user = await requireAuth();

  if (!hasRole(user, "ADMIN")) {
    throw new Error("Forbidden - Admin access required");
  }

  return user;
}

// Require seller role (or admin)
export async function requireSeller() {
  const user = await requireAuth();

  if (!hasRole(user, ["SELLER", "ADMIN"])) {
    throw new Error("Forbidden - Seller access required");
  }

  return user;
}
