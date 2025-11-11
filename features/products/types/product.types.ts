/**
 * Product Types
 * Sản phẩm trong hệ thống
 */

import type { Rating } from "./rating";
import type { Store } from "./store";

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number; // Market Retail Price (giá gốc)
  price: number; // Giá bán
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations (optional - chỉ khi include)
  store?: Store;
  rating?: Rating[];
}

/**
 * Product với thông tin đánh giá
 */
export interface ProductWithRating extends Omit<Product, "rating" | "store"> {
  rating: Rating[];
  averageRating?: number;
  totalRatings?: number;
  store?: Partial<Store> | Pick<Store, "id" | "name" | "username" | "logo">; // Flexible
}

/**
 * Product với thông tin Store
 */
export interface ProductWithStore extends Omit<Product, "store"> {
  store: Pick<Store, "id" | "name" | "username" | "logo">;
}

/**
 * Product Card Props - Cho component hiển thị
 */
export interface ProductCardData extends Omit<Product, "rating"> {
  rating: Array<{ rating: number }>;
  salePrice?: number;
}

/**
 * Serialized Product - Date → string
 */
export type SerializedProduct = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
