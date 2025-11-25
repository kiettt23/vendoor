"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("ProductActions");

// ============================================
// DELETE PRODUCT (Soft Delete)
// ============================================

interface DeleteProductResult {
  success: boolean;
  error?: string;
}

export async function deleteProduct(
  productId: string
): Promise<DeleteProductResult> {
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

    // 2. Get product to check ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        vendorId: true,
        name: true,
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
        error: "You can only delete your own products",
      };
    }

    // 4. Soft delete (set isActive = false)
    await prisma.product.update({
      where: { id: productId },
      data: {
        isActive: false,
      },
    });

    // 5. Revalidate
    revalidatePath("/vendor/products");

    return {
      success: true,
    };
  } catch (error) {
    logger.error("Failed to delete product", error);
    return {
      success: false,
      error: "Failed to delete product",
    };
  }
}
