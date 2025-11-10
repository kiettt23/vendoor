/**
 * Loại vai trò người dùng
 */
export type UserRole = "USER" | "SELLER" | "ADMIN";

/**
 * Type người dùng linh hoạt - tương thích với cả Better Auth và Prisma
 * Chỉ yêu cầu các field thực sự sử dụng
 */
export type AuthUser = {
  id?: string;
  email: string;
  role?: string | null;
  name?: string | null;
  image?: string | null;
} | null;

/**
 * Thông tin cửa hàng
 */
export interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string | null;
  status: string;
  isActive: boolean;
}

/**
 * Kết quả kiểm tra seller
 */
export interface SellerCheckResult {
  isSeller: boolean;
  storeInfo: StoreInfo | null;
}

/**
 * Seller có cửa hàng đã được duyệt
 */
export interface SellerWithStore {
  user: AuthUser;
  storeId: string;
  storeInfo: StoreInfo;
}
