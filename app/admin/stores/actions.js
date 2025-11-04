"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function toggleStoreActive(storeId) {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized: Please sign in");
    }

    // 2. Validate input
    if (!storeId) {
      throw new Error("Store ID is required");
    }

    // 3. Get current status
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { isActive: true },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // 4. Toggle active status
    await prisma.store.update({
      where: { id: storeId },
      data: {
        isActive: !store.isActive,
      },
    });

    // 5. Refresh the page data
    revalidatePath("/admin/stores");

    // 6. Return success with new status
    return {
      success: true,
      message: !store.isActive
        ? "Cửa hàng đã được kích hoạt!"
        : "Cửa hàng đã bị vô hiệu hóa!",
      isActive: !store.isActive,
    };
  } catch (error) {
    console.error("Error toggling store status:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Không thể thay đổi trạng thái cửa hàng"
    );
  }
}
