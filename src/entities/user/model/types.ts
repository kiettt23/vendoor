import type { UserModel, Role } from "@/generated/prisma";
import type { getSession } from "@/shared/lib/auth/session";

export type User = UserModel;

export type UserRole = Role;

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: UserRole[];
}

export interface UserSession {
  user: SessionUser;
  session: { id: string; expiresAt: Date };
}

export interface AuthResult {
  session: NonNullable<Awaited<ReturnType<typeof getSession>>>;
  user: {
    id: string;
    roles: UserRole[];
    name?: string | null;
    email?: string | null;
  };
}
