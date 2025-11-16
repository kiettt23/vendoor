"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";

// ============================================
// GET PRODUCT BY ID
// ============================================

interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isDefault: boolean;
}

interface ProductImage {
  id: string;
  url: string;
  order: number;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string;
  vendorId: string;
  isActive: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
}

interface GetProductByIdResult {
  success: boolean;
  product?: ProductDetail;
  error?: string;
}

export async function getProductById(
  productId: string
): Promise<GetProductByIdResult> {
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

    // 2. Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        categoryId: true,
        vendorId: true,
        isActive: true,
        variants: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            compareAtPrice: true,
            stock: true,
            isDefault: true,
          },
          orderBy: {
            isDefault: "desc", // Default variant first
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!product) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    // 3. Check ownership
    if (product.vendorId !== session.user.id) {
      return {
        success: false,
        error: "You can only edit your own products",
      };
    }

    // 4. Return product
    return {
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        vendorId: product.vendorId,
        isActive: product.isActive,
        variants: product.variants.map((v) => ({
          id: v.id,
          name: v.name ?? "",
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          isDefault: v.isDefault,
        })),
        images: product.images,
      },
    };
  } catch (error) {
    console.error("[getProductById] Error:", error);
    return {
      success: false,
      error: "Failed to get product",
    };
  }
}
