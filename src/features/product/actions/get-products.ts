"use server";

import { prisma } from "@/shared/lib/prisma";

// ============================================
// TYPES
// ============================================

interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number; // Giá của default variant
  compareAtPrice: number | null;
  image: string; // Ảnh đầu tiên
  vendor: {
    id: string;
    name: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface GetProductsResult {
  products: ProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// GET PRODUCTS
// ============================================

export async function getProducts(
  params: GetProductsParams = {}
): Promise<GetProductsResult> {
  const { categorySlug, search, page = 1, limit = 12 } = params;

  // Build where clause
  const where: {
    isActive: boolean;
    category?: { slug: string };
    name?: { contains: string; mode: "insensitive" };
  } = {
    isActive: true, // Chỉ lấy products active
  };

  // Filter by category
  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  // Search by name
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive", // Case-insensitive search
    };
  }

  // Count total products (for pagination)
  const total = await prisma.product.count({ where });

  // Fetch products
  const products = await prisma.product.findMany({
    where,
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
        where: { isDefault: true }, // Lấy default variant để có giá
        select: {
          price: true,
          compareAtPrice: true,
        },
      },
      images: {
        where: { order: 0 }, // Lấy ảnh đầu tiên
        take: 1,
        select: {
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Mới nhất trước
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Transform data
  const productsFormatted: ProductListItem[] = products.map((product) => ({
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

  return {
    products: productsFormatted,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ============================================
// GET CATEGORIES (cho filter)
// ============================================

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: true, // Đếm số products trong category
        },
      },
    },
  });
}
