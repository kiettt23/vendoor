/**
 * Shared Prisma include builders
 *
 * Centralized include configurations để tránh duplicate code
 * trong các query files. Mỗi builder tạo ra một include object
 * có thể reuse cho các queries tương tự.
 */

import { LIMITS } from "../constants";
import type { Prisma } from "@/generated/prisma/client/client";

// ============================================================================
// Product Includes
// ============================================================================

/**
 * Include cho product list items (homepage, search, category pages)
 * Bao gồm vendor, category, default variant, first image, và reviews
 */
export const productListInclude = {
  vendor: {
    select: {
      id: true,
      vendorProfile: { select: { shopName: true } },
    },
  },
  category: { select: { name: true, slug: true } },
  variants: {
    where: { isDefault: true },
    select: { id: true, price: true, compareAtPrice: true, stock: true },
  },
  images: { where: { order: 0 }, take: 1, select: { url: true } },
  reviews: {
    where: { status: "APPROVED" as const },
    select: { rating: true },
  },
} satisfies Prisma.ProductInclude;

/**
 * Include cho product detail page
 * Bao gồm full vendor info, category, tất cả variants và images
 */
export const productDetailInclude = {
  vendor: {
    select: {
      id: true,
      name: true,
      vendorProfile: {
        select: { id: true, shopName: true, slug: true, status: true },
      },
    },
  },
  category: { select: { id: true, name: true, slug: true } },
  variants: { orderBy: { isDefault: "desc" as const } },
  images: { orderBy: { order: "asc" as const } },
} satisfies Prisma.ProductInclude;

/**
 * Include cho flash sale products
 * Chỉ lấy variant đầu tiên có compareAtPrice và first image
 */
export const flashSaleProductInclude = {
  variants: {
    where: { compareAtPrice: { not: null } },
    orderBy: { isDefault: "desc" as const },
    take: 1,
  },
  images: { orderBy: { order: "asc" as const }, take: 1 },
  vendor: {
    select: {
      vendorProfile: { select: { shopName: true } },
    },
  },
} satisfies Prisma.ProductInclude;

/**
 * Include cho vendor product list (dashboard)
 * Lightweight version chỉ cần thông tin cơ bản
 */
export const vendorProductListInclude = {
  category: { select: { name: true } },
  variants: {
    where: { isDefault: true },
    select: { price: true, stock: true },
  },
  images: { take: LIMITS.FIRST_IMAGE, orderBy: { order: "asc" as const } },
} satisfies Prisma.ProductInclude;

/**
 * Include cho vendor product edit form
 * Bao gồm tất cả variants và images để edit
 */
export const vendorProductEditInclude = {
  images: {
    select: { id: true, url: true },
    orderBy: { order: "asc" as const },
  },
  variants: {
    select: {
      id: true,
      name: true,
      color: true,
      size: true,
      price: true,
      compareAtPrice: true,
      sku: true,
      stock: true,
      isDefault: true,
    },
  },
} satisfies Prisma.ProductInclude;

// ============================================================================
// Type Helpers
// ============================================================================

/**
 * Type helper để extract product type từ query với include
 * Usage: type MyProduct = ProductWithInclude<typeof productListInclude>
 */
export type ProductWithInclude<T extends Prisma.ProductInclude> =
  Prisma.ProductGetPayload<{ include: T }>;

// ============================================================================
// Order Includes
// ============================================================================

export const orderListInclude = {
  vendor: { select: { shopName: true } },
  items: { select: { productName: true, quantity: true }, take: 2 },
  _count: { select: { items: true } },
} satisfies Prisma.OrderInclude;

export const orderDetailInclude = {
  vendor: { select: { shopName: true } },
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { order: "asc" as const } },
            },
          },
        },
      },
    },
  },
  payment: true,
} satisfies Prisma.OrderInclude;

export const vendorOrderListInclude = {
  customer: { select: { name: true, email: true } },
  _count: { select: { items: true } },
} satisfies Prisma.OrderInclude;

export const vendorOrderDetailInclude = {
  customer: { select: { name: true, email: true, phone: true } },
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { order: "asc" as const } },
            },
          },
        },
      },
    },
  },
  payment: true,
} satisfies Prisma.OrderInclude;

export const adminOrderListInclude = {
  customer: { select: { name: true, email: true } },
  vendor: { select: { shopName: true } },
  items: { select: { productName: true }, take: 1 },
} satisfies Prisma.OrderInclude;

export const adminOrderDetailInclude = {
  customer: { select: { id: true, name: true, email: true, phone: true } },
  vendor: { select: { id: true, shopName: true, slug: true } },
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: { take: 1, orderBy: { order: "asc" as const } },
            },
          },
        },
      },
    },
  },
  payment: true,
} satisfies Prisma.OrderInclude;

export type OrderWithInclude<T extends Prisma.OrderInclude> =
  Prisma.OrderGetPayload<{ include: T }>;
