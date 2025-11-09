export type UserRole = "USER" | "SELLER" | "ADMIN";

export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string | null;
  status: string;
  isActive: boolean;
}

export interface SellerCheckResult {
  isSeller: boolean;
  storeInfo: StoreInfo | null;
}

// Seller with approved store (for guards)
export interface SellerWithStore {
  user: any; // Better Auth user type
  storeId: string;
  storeInfo: StoreInfo;
}
