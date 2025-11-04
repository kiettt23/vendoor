"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function approveStore(storeId) {
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

    // 3. Update store in database
    await prisma.store.update({
      where: { id: storeId },
      data: {
        status: "approved",
        isActive: true,
      },
    });

    // 4. Refresh the page data (Server Component will re-fetch)
    revalidatePath("/admin/approve");

    // 5. Return success
    return { success: true, message: "Cửa hàng đã được phê duyệt!" };
  } catch (error) {
    console.error("Error approving store:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể phê duyệt cửa hàng"
    );
  }
}

export async function rejectStore(storeId) {
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

    // 3. Delete store from database
    await prisma.store.delete({
      where: { id: storeId },
    });

    // 4. Refresh the page data
    revalidatePath("/admin/approve");

    // 5. Return success
    return { success: true, message: "Cửa hàng đã bị từ chối!" };
  } catch (error) {
    console.error("Error rejecting store:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể từ chối cửa hàng"
    );
  }
}
