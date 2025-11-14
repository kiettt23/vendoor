"use server";

import { prisma } from "@/shared/lib/prisma";

// ============================================
// TYPES
// ============================================

interface ProductVariantDetail {
  id: string;
  name: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  color: string | null;
  size: string | null;
  isDefault: boolean;
}

interface ProductImageDetail {
  id: string;
  url: string;
  altText: string | null;
  order: number;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  vendor: {
    id: string;
    name: string;
    shopName: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariantDetail[];
  images: ProductImageDetail[];
  createdAt: Date;
}

// ============================================
// GET PRODUCT BY SLUG
// ============================================

export async function getProductBySlug(
  slug: string
): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: {
      slug,
      isActive: true, // Chỉ lấy product active
    },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
          vendorProfile: {
            select: {
              shopName: true,
              slug: true,
            },
          },
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      variants: {
        orderBy: {
          isDefault: "desc", // Default variant first
        },
      },
      images: {
        orderBy: {
          order: "asc", // Ảnh theo thứ tự
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Transform data
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    vendor: {
      id: product.vendor.id,
      name: product.vendor.name || "Unknown Vendor",
      shopName: product.vendor.vendorProfile?.shopName || "Unknown Shop",
      slug: product.vendor.vendorProfile?.slug || "",
    },
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    variants: product.variants,
    images: product.images,
    createdAt: product.createdAt,
  };
}

// ============================================
// GET RELATED PRODUCTS (same category)
// ============================================

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
  limit: number = 4
) {
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: {
        not: currentProductId, // Exclude current product
      },
    },
    include: {
      vendor: {
        select: {
          id: true,
          name: true,
        },
      },
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      variants: {
        where: { isDefault: true },
        select: {
          price: true,
          compareAtPrice: true,
        },
      },
      images: {
        where: { order: 0 },
        take: 1,
        select: {
          url: true,
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.variants[0]?.price || 0,
    compareAtPrice: product.variants[0]?.compareAtPrice || null,
    image: product.images[0]?.url || "",
    vendor: {
      id: product.vendor.id,
      name: product.vendor.name || "Unknown Vendor",
    },
    category: {
      name: product.category.name,
      slug: product.category.slug,
    },
  }));
}
