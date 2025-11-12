"use server";

import prisma from "@/shared/configs/prisma";
import { requireAdmin } from "@/features/auth/index.server";
import { revalidatePath } from "next/cache";

interface ActionResponse {
  success: boolean;
  message: string;
  isActive?: boolean;
}

// Get all stores for admin
export async function getStores() {
  await requireAdmin();

  const stores = await prisma.store.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          Product: true,
          Order: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return stores;
}

// Get pending stores for approval
export async function getPendingStores() {
  await requireAdmin();

  const stores = await prisma.store.findMany({
    where: {
      status: "pending",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return stores;
}

// Approve a store
export async function approveStore(storeId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!storeId) {
      throw new Error("Store ID is required");
    }

    await prisma.store.update({
      where: { id: storeId },
      data: {
        status: "approved",
        isActive: true,
      },
    });

    revalidatePath("/admin/approve");
    revalidatePath("/admin/stores");

    return { success: true, message: "Cửa hàng đã được phê duyệt!" };
  } catch (error) {
    console.error("Error approving store:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể phê duyệt cửa hàng"
    );
  }
}

// Reject a store (delete it)
export async function rejectStore(storeId: string): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!storeId) {
      throw new Error("Store ID is required");
    }

    await prisma.store.delete({
      where: { id: storeId },
    });

    revalidatePath("/admin/approve");
    revalidatePath("/admin/stores");

    return { success: true, message: "Cửa hàng đã bị từ chối!" };
  } catch (error) {
    console.error("Error rejecting store:", error);
    throw new Error(
      error instanceof Error ? error.message : "Không thể từ chối cửa hàng"
    );
  }
}

// Toggle store active status
export async function toggleStoreActive(
  storeId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!storeId) {
      throw new Error("Store ID is required");
    }

    // Get current status
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { isActive: true },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Toggle active status
    const newStatus = !store.isActive;

    await prisma.store.update({
      where: { id: storeId },
      data: { isActive: newStatus },
    });

    revalidatePath("/admin/stores");

    return {
      success: true,
      message: newStatus
        ? "Cửa hàng đã được kích hoạt!"
        : "Cửa hàng đã bị vô hiệu hóa!",
      isActive: newStatus,
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
