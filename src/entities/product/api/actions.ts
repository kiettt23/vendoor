"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";
import { generateTimestampSlug, ok, err, type Result } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/constants";

import type { ProductFormInput, ProductEditInput } from "../model";

export type SearchSuggestion = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number | null;
  category: string | null;
  categorySlug: string | null;
};

export async function searchProductsAction(
  query: string,
  limit = 5
): Promise<SearchSuggestion[]> {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      images: {
        where: { order: 0 },
        take: 1,
        select: { url: true },
      },
      variants: {
        where: { isDefault: true },
        take: 1,
        select: { price: true },
      },
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { name: "asc" },
    take: limit,
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.images[0]?.url ?? null,
    price: p.variants[0]?.price ?? null,
    category: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));
}

export async function createProduct(
  vendorId: string,
  data: ProductFormInput
): Promise<Result<string>> {
  // Thêm timestamp để đảm bảo slug unique
  const slug = generateTimestampSlug(data.name);

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
        // Create image if provided
        ...(data.imageUrl && {
          images: {
            create: {
              url: data.imageUrl,
              order: 0,
            },
          },
        }),
      },
    });
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(product.id);
  } catch {
    return err("Không thể tạo sản phẩm");
  }
}

export async function updateProduct(
  productId: string,
  data: ProductEditInput
): Promise<Result<void>> {
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
      },
    });
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(undefined);
  } catch {
    return err("Không thể cập nhật sản phẩm");
  }
}

export async function deleteProduct(productId: string): Promise<Result<void>> {
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath(ROUTES.VENDOR_PRODUCTS);
    return ok(undefined);
  } catch {
    return err("Không thể xóa sản phẩm");
  }
}
