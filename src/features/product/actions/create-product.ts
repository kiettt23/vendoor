"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createProductSchema, type CreateProductInput } from "../schema";
import { generateUniqueSlug } from "../lib/utils";

// ============================================
// CREATE PRODUCT
// ============================================

interface CreateProductResult {
  success: boolean;
  productId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createProduct(
  data: CreateProductInput
): Promise<CreateProductResult> {
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
        error: "Only vendors can create products",
      };
    }

    // 3. Validate input
    const validation = createProductSchema.safeParse(data);
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

    // 4. Generate unique slug
    const slug = await generateUniqueSlug(validData.name, async (slug) => {
      const existing = await prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      });
      return !!existing;
    });

    // 5. Create product with variants and images in transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create product
      const newProduct = await tx.product.create({
        data: {
          name: validData.name,
          slug,
          description: validData.description || null,
          vendorId: session.user.id,
          categoryId: validData.categoryId,
          isActive: true,
        },
      });

      // Create variants
      await tx.productVariant.createMany({
        data: validData.variants.map((variant) => ({
          productId: newProduct.id,
          name: variant.name,
          sku: variant.sku || null,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice || null,
          stock: variant.stock,
          isDefault: variant.isDefault,
        })),
      });

      // Create images
      await tx.productImage.createMany({
        data: validData.images.map((image) => ({
          productId: newProduct.id,
          url: image.url,
          order: image.order,
        })),
      });

      return newProduct;
    });

    // 6. Revalidate
    revalidatePath("/vendor/products");
    revalidatePath("/products");

    return {
      success: true,
      productId: product.id,
    };
  } catch (error) {
    console.error("[createProduct] Error:", error);
    return {
      success: false,
      error: "Failed to create product",
    };
  }
}
