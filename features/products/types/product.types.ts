/**
 * Product Types
 */

import type { Rating } from "@/features/ratings/types/rating.types";

export interface ProductStore {
  id: string;
  name: string;
  username: string;
  logo?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  mrp: number;
  price: number;
  images: string[];
  category: string;
  inStock: boolean;
  storeId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  store?: ProductStore;
  rating?: Rating[];
}

export interface ProductWithRating extends Omit<Product, "rating" | "store"> {
  rating: Rating[];
  averageRating?: number;
  totalRatings?: number;
  store?: ProductStore;
}

export interface ProductWithStore extends Omit<Product, "store"> {
  store: ProductStore;
}

export interface ProductCardData extends Omit<Product, "rating"> {
  rating: Array<{ rating: number }>;
  salePrice?: number;
}

export type SerializedProduct = Omit<Product, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
