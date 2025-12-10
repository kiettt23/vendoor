/**
 * User Types
 *
 * Tận dụng Prisma generated types cho base models.
 */

import type { UserModel, Role } from "@/generated/prisma";

// Base Types (từ Prisma Generated)

/**
 * Base User type từ database
 */
export type User = UserModel;

/**
 * User role từ Prisma enum
 */
export type UserRole = Role;

// Derived Types (cho specific use cases)

/**
 * User trong session (minimal fields)
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: UserRole[];
}

/**
 * Full user session với session info
 */
export interface UserSession {
  user: SessionUser;
  session: { id: string; expiresAt: Date };
}
