export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  vendorId: string;
  categoryId: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  vendor: { id: string; name: string };
  category: { name: string; slug: string };
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string | null;
  sku: string | null;
  color: string | null;
  size: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isDefault: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  order: number;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

export interface CategoryWithCount extends Category {
  _count: { products: number };
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
