"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { ok, err, type Result } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/constants";
import type { CreateVariantData, VariantFormData } from "../model";

export async function createVariant(
  productId: string,
  data: CreateVariantData
): Promise<Result<string>> {
  try {
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
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(variant.id);
  } catch {
    return err("Không thể tạo biến thể");
  }
}

export async function updateVariant(
  variantId: string,
  data: VariantFormData
): Promise<Result<void>> {
  try {
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
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(undefined);
  } catch {
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
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(undefined);
  } catch {
    return err("Không thể xóa biến thể");
  }
}

export async function setDefaultVariant(
  variantId: string,
  productId: string
): Promise<Result<void>> {
  try {
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
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(undefined);
  } catch {
    return err("Không thể đặt biến thể mặc định");
  }
}
