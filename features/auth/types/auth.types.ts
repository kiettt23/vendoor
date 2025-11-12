/**
 * Auth Types
 */

export type UserRole = "USER" | "SELLER" | "ADMIN";

export type StoreStatus = "pending" | "approved" | "rejected";

export type AuthUser = {
  id: string; // Required - always present when authenticated
  email?: string;
  username?: string;
  role?: string;
  name?: string;
  image?: string;
};

export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string | null;
  status: StoreStatus;
  isActive: boolean;
}

export interface SellerStoreResult {
  isSeller: boolean;
  storeInfo: StoreInfo | null;
}

export interface SellerWithStore {
  user: NonNullable<AuthUser>;
  storeId: string;
  storeInfo: StoreInfo;
}

export interface DeviceSession {
  session: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    username?: string;
  };
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
