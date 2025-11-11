export type UserRole = "USER" | "SELLER" | "ADMIN";

export type StoreStatus = "pending" | "approved" | "rejected";

export type AuthUser = {
  id: string;
  email?: string;
  username?: string;
  role?: string;
  name?: string;
  image?: string;
} | null;

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
