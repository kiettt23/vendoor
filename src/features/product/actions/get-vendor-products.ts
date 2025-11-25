"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("ProductActions");

// ============================================
// TYPES
// ============================================

interface GetVendorProductsParams {
  search?: string;
  status?: "all" | "active" | "inactive"; // Filter by isActive
  page?: number;
  limit?: number;
}

interface VendorProductListItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  category: {
    name: string;
  };
  // Price range từ variants
  priceRange: {
    min: number;
    max: number;
  };
  // Tổng stock từ tất cả variants
  totalStock: number;
  // Ảnh đầu tiên
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GetVendorProductsResult {
  success: boolean;
  products?: VendorProductListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// ============================================
// GET VENDOR PRODUCTS
// ============================================

export async function getVendorProducts(
  params: GetVendorProductsParams = {}
): Promise<GetVendorProductsResult> {
  try {
    // 1. Check auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 2. Check if user is vendor
    if (!session.user.roles?.includes("VENDOR")) {
      return {
        success: false,
        error: "Only vendors can access this",
      };
    }

    // 3. Parse params
    const { search, status = "all", page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    // 4. Build where clause
    interface WhereClause {
      vendorId: string;
      isActive?: boolean;
      name?: {
        contains: string;
        mode: "insensitive";
      };
    }

    const where: WhereClause = {
      vendorId: session.user.id, // Chỉ lấy products của vendor này
    };

    // Filter by status
    if (status === "active") {
      where.isActive = true;
    } else if (status === "inactive") {
      where.isActive = false;
    }
    // status === "all" → không filter isActive

    // Search by name
    if (search && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: "insensitive" as const,
      };
    }

    // 5. Get total count
    const total = await prisma.product.count({ where });

    // 6. Get products
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            name: true,
          },
        },
        variants: {
          select: {
            price: true,
            stock: true,
          },
        },
        images: {
          select: {
            url: true,
          },
          orderBy: {
            order: "asc" as const,
          },
          take: 1, // Chỉ lấy ảnh đầu tiên
        },
      },
      orderBy: {
        updatedAt: "desc" as const, // Products mới nhất trước
      },
      skip,
      take: limit,
    });

    // 7. Transform data
    const transformedProducts: VendorProductListItem[] = products.map(
      (product) => {
        // Calculate price range from variants
        const prices = product.variants.map((v) => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Calculate total stock
        const totalStock = product.variants.reduce(
          (sum, v) => sum + v.stock,
          0
        );

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          isActive: product.isActive,
          category: {
            name: product.category.name,
          },
          priceRange: {
            min: minPrice,
            max: maxPrice,
          },
          totalStock,
          image: product.images[0]?.url ?? null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      }
    );

    // 8. Return result
    return {
      success: true,
      products: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    logger.error("Failed to get vendor products", error);
    return {
      success: false,
      error: "Failed to get products",
    };
  }
}
