/**
 * Rating Types
 * Đánh giá sản phẩm
 */

import type { User } from "./user";
import type { Product } from "./product";

export interface Rating {
  id: string;
  rating: number; // 1-5 stars
  review: string;
  userId: string;
  productId: string;
  orderId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  user?: Pick<User, "id" | "name" | "image"> | { name: string; image: string }; // Flexible
  product?: Pick<Product, "id" | "name">;
}

/**
 * Serialized Rating - Date → string
 */
export type SerializedRating = Omit<Rating, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * Rating Form Data
 */
export interface RatingFormData {
  rating: number;
  review: string;
  productId: string;
  orderId: string;
}

/**
 * Rating Modal State
 */
export interface RatingModalState {
  productId: string;
  orderId: string;
}
