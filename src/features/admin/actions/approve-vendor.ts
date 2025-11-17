"use server";

import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function approveVendor(vendorId: string) {
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
        error: `Không thể duyệt vendor có trạng thái ${vendor.status}`,
      };
    }

    // Update vendor status to APPROVED
    await prisma.vendorProfile.update({
      where: { id: vendorId },
      data: { status: "APPROVED" },
    });

    // TODO Post-MVP: Send approval email notification

    revalidatePath("/admin/vendors");
    return {
      success: true,
      message: "Vendor đã được duyệt thành công",
    };
  } catch (error) {
    console.error("Error approving vendor:", error);
    return {
      success: false,
      error: "Không thể duyệt vendor",
    };
  }
}
