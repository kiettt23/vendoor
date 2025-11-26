export type UserRole = "CUSTOMER" | "VENDOR" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  image: string | null;
  emailVerified: boolean;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

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

