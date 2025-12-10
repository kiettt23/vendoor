import { cache } from "react";

import { prisma } from "@/shared/lib/db";
import type { WishlistItemWithProduct } from "../model";

export const getUserWishlist = cache(
  async (userId: string): Promise<WishlistItemWithProduct[]> => {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: {
        id: true,
        createdAt: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
            vendor: {
              select: {
                id: true,
                name: true,
              },
            },
            variants: {
              where: { isDefault: true },
              select: {
                id: true,
                price: true,
                compareAtPrice: true,
                stock: true,
              },
            },
            images: {
              where: { order: 0 },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return items.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        isActive: item.product.isActive,
        image: item.product.images[0]?.url || "",
        price: item.product.variants[0]?.price || 0,
        compareAtPrice: item.product.variants[0]?.compareAtPrice || null,
        stock: item.product.variants[0]?.stock || 0,
        variantId: item.product.variants[0]?.id || "",
        vendor: {
          id: item.product.vendor.id,
          name: item.product.vendor.name || "Unknown",
        },
      },
    }));
  }
);

export const isInWishlist = cache(
  async (userId: string, productId: string): Promise<boolean> => {
    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      select: { id: true },
    });

    return !!item;
  }
);

export const getWishlistCount = cache(
  async (userId: string): Promise<number> => {
    return prisma.wishlist.count({ where: { userId } });
  }
);

export const getWishlistProductIds = cache(
  async (userId: string): Promise<string[]> => {
    const items = await prisma.wishlist.findMany({
      where: { userId },
      select: { productId: true },
    });

    return items.map((item) => item.productId);
  }
);
