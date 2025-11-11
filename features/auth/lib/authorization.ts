import type { AuthUser } from "./types";

export function isAdmin(user: AuthUser): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  if (!user.email) return false;

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
  return adminEmails.includes(user.email);
}

export function isSeller(user: AuthUser): boolean {
  if (!user || !user.role) return false;
  return user.role === "SELLER";
}

export function hasRole(user: AuthUser, roles: string | string[]): boolean {
  if (!user || !user.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
}
