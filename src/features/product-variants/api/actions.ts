"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result, createLogger } from "@/shared/lib/utils";
import { ROUTES, CACHE_TAGS } from "@/shared/lib/constants";
import type { CreateVariantData, VariantFormData } from "../model";

const logger = createLogger("product-variants");

// ============================================================================
// Helpers
// ============================================================================

function revalidateVariantCache(vendorId?: string) {
  revalidateTag(CACHE_TAGS.PRODUCTS, "page");
  if (vendorId) {
    revalidateTag(CACHE_TAGS.PRODUCTS_BY_VENDOR(vendorId), "page");
  }
  revalidatePath(ROUTES.VENDOR_PRODUCTS);
}

// ============================================================================
// Actions
// ============================================================================

export async function createVariant(
  productId: string,
  data: CreateVariantData
): Promise<Result<string>> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return err("Không tìm thấy sản phẩm");
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name: data.name,
        color: data.color,
        size: data.size,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        stock: data.stock,
        isDefault: false,
      },
    });

    revalidateVariantCache(product.vendorId);
    return ok(variant.id);
  } catch (error) {
    logger.error("createVariant error:", error);
    return err("Không thể tạo biến thể");
  }
}

export async function updateVariant(
  variantId: string,
  data: VariantFormData
): Promise<Result<void>> {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      select: { product: { select: { vendorId: true } } },
    });

    if (!variant) {
      return err("Không tìm thấy biến thể");
    }

    await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        name: data.name,
        color: data.color,
        size: data.size,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        stock: data.stock,
      },
    });

    revalidateVariantCache(variant.product.vendorId);
    return ok(undefined);
  } catch (error) {
    logger.error("updateVariant error:", error);
    return err("Không thể cập nhật biến thể");
  }
}

export async function deleteVariant(variantId: string): Promise<Result<void>> {
  try {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: { include: { variants: true } } },
    });

    if (!variant) {
      return err("Không tìm thấy biến thể");
    }

    if (variant.isDefault) {
      return err("Không thể xóa biến thể mặc định");
    }

    if (variant.product.variants.length <= 1) {
      return err("Sản phẩm phải có ít nhất 1 biến thể");
    }

    await prisma.productVariant.delete({ where: { id: variantId } });
    revalidateVariantCache(variant.product.vendorId);
    return ok(undefined);
  } catch (error) {
    logger.error("deleteVariant error:", error);
    return err("Không thể xóa biến thể");
  }
}

export async function setDefaultVariant(
  variantId: string,
  productId: string
): Promise<Result<void>> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    if (!product) {
      return err("Không tìm thấy sản phẩm");
    }

    await prisma.$transaction([
      prisma.productVariant.updateMany({
        where: { productId },
        data: { isDefault: false },
      }),
      prisma.productVariant.update({
        where: { id: variantId },
        data: { isDefault: true },
      }),
    ]);

    revalidateVariantCache(product.vendorId);
    return ok(undefined);
  } catch (error) {
    logger.error("setDefaultVariant error:", error);
    return err("Không thể đặt biến thể mặc định");
  }
}
