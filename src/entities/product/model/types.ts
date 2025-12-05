/**
 * Product Types
 *
 * Tận dụng Prisma generated types cho base models,
 * chỉ define thêm các derived types cho specific use cases.
 */

import type {
  ProductModel,
  ProductVariantModel,
  ProductImageModel,
} from "@/generated/prisma";

// ============================================
// Base Types (từ Prisma Generated)
// ============================================

/**
 * Base Product type từ database
 */
export type Product = ProductModel;

/**
 * Base ProductVariant type từ database
 */
export type ProductVariant = ProductVariantModel;

/**
 * Base ProductImage type từ database
 */
export type ProductImage = ProductImageModel;

// ============================================
// Derived Types (cho specific use cases)
// ============================================

/**
 * Product item cho danh sách (optimized fields)
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  stock: number;
  variantId: string;
  vendor: { id: string; name: string };
  category: { name: string; slug: string };
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  vendor: {
    id: string; // User.id (owner)
    vendorProfileId: string; // VendorProfile.id (for orders)
    name: string;
    shopName: string;
    slug: string;
  };
  category: { id: string; name: string; slug: string };
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedProducts {
  products: ProductListItem[];
  pagination: PaginationMeta;
}

// ============================================
// Action Types
// ============================================

export interface ProductFormInput {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}
