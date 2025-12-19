import type {
  ProductModel,
  ProductVariantModel,
  ProductImageModel,
} from "@/generated/prisma";

export type Product = ProductModel;
export type ProductVariant = ProductVariantModel;
export type ProductImage = ProductImageModel;

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  stock: number;
  variantId: string;
  vendor: { id: string; shopName: string };
  category: { name: string; slug: string };
  rating: number | null;
  reviewCount: number;
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

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number | null;
  category: string | null;
  categorySlug: string | null;
}

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

export interface ProductEditInput {
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
}

export interface FlashSaleProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  sold: number;
  total: number;
  store: string;
}

export interface AddToCartData {
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string | null;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  vendorId: string;
  vendorName: string;
}
