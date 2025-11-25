"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("AdminActions");

export async function rejectVendor(vendorId: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check admin role
  if (!session || !session.user.roles?.includes("ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Check if vendor exists and is PENDING
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { status: true },
    });

    if (!vendor) {
      return { success: false, error: "Vendor không tồn tại" };
    }

    if (vendor.status !== "PENDING") {
      return {
        success: false,
        error: `Không thể từ chối vendor có trạng thái ${vendor.status}`,
      };
    }

    // Update vendor status to REJECTED
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: "REJECTED" },
    });

    // TODO Post-MVP: Send rejection email

    revalidatePath("/admin/vendors");
    return {
      success: true,
      message: "Vendor đã bị từ chối",
    };
  } catch (error) {
    logger.error("Failed to reject vendor", error);
    return {
      success: false,
      error: "Không thể từ chối vendor",
    };
  }
}
