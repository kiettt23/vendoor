"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { updateProductSchema, type UpdateProductInput } from "../schema";
import { generateUniqueSlug } from "../lib/utils";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("ProductActions");

// ============================================
// UPDATE PRODUCT
// ============================================

interface UpdateProductResult {
  success: boolean;
  productId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateProduct(
  data: UpdateProductInput
): Promise<UpdateProductResult> {
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
        error: "Only vendors can update products",
      };
    }

    // 3. Validate input
    const validation = updateProductSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data",
        fieldErrors: validation.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const validData = validation.data;

    // 4. Check product exists and ownership
    const existingProduct = await prisma.product.findUnique({
      where: { id: validData.id },
      select: {
        id: true,
        vendorId: true,
        slug: true,
        name: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: "Product not found",
      };
    }

    if (existingProduct.vendorId !== session.user.id) {
      return {
        success: false,
        error: "You can only update your own products",
      };
    }

    // 5. Generate new slug if name changed
    let slug = existingProduct.slug;
    if (validData.name !== existingProduct.name) {
      slug = await generateUniqueSlug(validData.name, async (testSlug) => {
        // Skip current product's slug
        if (testSlug === existingProduct.slug) return false;

        const existing = await prisma.product.findUnique({
          where: { slug: testSlug },
          select: { id: true },
        });
        return !!existing;
      });
    }

    // 6. Update product in transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update product basic info
      const updatedProduct = await tx.product.update({
        where: { id: validData.id },
        data: {
          name: validData.name,
          slug,
          description: validData.description || null,
          categoryId: validData.categoryId,
        },
      });

      // Delete old variants and images (will recreate them)
      await tx.productVariant.deleteMany({
        where: { productId: validData.id },
      });

      await tx.productImage.deleteMany({
        where: { productId: validData.id },
      });

      // Create new variants
      await tx.productVariant.createMany({
        data: validData.variants.map((variant) => ({
          productId: validData.id,
          name: variant.name,
          sku: variant.sku || null,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || null,
          stock: variant.stock,
          isDefault: variant.isDefault,
        })),
      });

      // Create new images
      await tx.productImage.createMany({
        data: validData.images.map((image) => ({
          productId: validData.id,
          url: image.url,
          order: image.order,
        })),
      });

      return updatedProduct;
    });

    // 7. Revalidate
    revalidatePath("/vendor/products");
    revalidatePath(`/vendor/products/${product.id}/edit`);
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      productId: product.id,
    };
  } catch (error) {
    logger.error("Failed to update product", error);
    return {
      success: false,
      error: "Failed to update product",
    };
  }
}
