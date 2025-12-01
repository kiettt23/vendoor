"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { slugify, ok, err, type Result } from "@/shared/lib/utils";

import type { ProductFormInput } from "../model";

// ============================================
// Actions
// ============================================

export async function createProduct(
  vendorId: string,
  data: ProductFormInput
): Promise<Result<string>> {
  // Thêm timestamp để đảm bảo slug unique
  const slug = `${slugify(data.name)}-${Date.now().toString(36)}`;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        categoryId: data.categoryId,
        vendorId,
        isActive: data.isActive,
        variants: {
          create: {
            name: null,
            price: data.price,
            compareAtPrice: data.compareAtPrice || null,
            sku: data.sku,
            stock: data.stock,
            isDefault: true,
          },
        },
      },
    });
    revalidatePath("/vendor/products");
    return ok(product.id);
  } catch {
    return err("Không thể tạo sản phẩm");
  }
}

export async function updateProduct(
  productId: string,
  data: ProductFormInput
): Promise<Result<void>> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        variants: {
          updateMany: {
            where: { isDefault: true },
            data: {
              price: data.price,
              compareAtPrice: data.compareAtPrice || null,
              sku: data.sku,
              stock: data.stock,
            },
          },
        },
      },
    });
    revalidatePath("/vendor/products");
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật sản phẩm");
  }
}

export async function deleteProduct(productId: string): Promise<Result<void>> {
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/vendor/products");
    return ok(undefined);
  } catch {
    return err("Không thể xóa sản phẩm");
  }
}
