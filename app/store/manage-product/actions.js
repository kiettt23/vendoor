"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleProductStock(productId) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate input
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // 3. Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: { userId: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== userId) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // 4. Toggle stock status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        inStock: !product.inStock,
      },
    });

    // 5. Refresh the page data
    revalidatePath("/store/manage-product");

    // 6. Return success with new status
    return {
      success: true,
      message: updatedProduct.inStock
        ? "Sản phẩm đã có hàng!"
        : "Sản phẩm đã hết hàng!",
      inStock: updatedProduct.inStock,
    };
  } catch (error) {
    console.error("Error toggling product stock:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Không thể thay đổi trạng thái sản phẩm"
    );
  }
}

export async function deleteProduct(productId) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate input
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // 3. Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: {
          select: { userId: true },
        },
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.store.userId !== userId) {
      throw new Error("Unauthorized: You don't own this product");
    }

    // 4. Delete product from database
    await prisma.product.delete({
      where: { id: productId },
    });

    // 5. Refresh the page data
    revalidatePath("/store/manage-product");

    // 6. Return success
    return {
      success: true,
      message: "Đã xóa sản phẩm!",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể xóa sản phẩm"
    );
  }
}
