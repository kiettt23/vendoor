/**
 * User Types
 * Người dùng từ Clerk + Prisma
 */

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  cart: Record<string, number>; // { "productId": quantity }
}

/**
 * User Profile - Extended với thông tin bổ sung
 */
export interface UserProfile extends User {
  totalOrders?: number;
  totalSpent?: number;
  memberSince?: Date | string;
}

/**
 * Clerk User Metadata
 */
export interface ClerkUserMetadata {
  role?: "admin" | "seller" | "user";
  isPlusMember?: boolean;
  plusMembershipExpiry?: string;
}
