"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/db";

import type { VendorStatus } from "@/generated/prisma";

// ============================================
// Vendor Admin Actions
// ============================================

/**
 * Duyệt vendor và cấp role VENDOR cho user
 */
export async function approveVendor(vendorId: string) {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "APPROVED" },
  });

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id: vendorId },
    select: { userId: true },
  });

  if (vendor) {
    const user = await prisma.user.findUnique({
      where: { id: vendor.userId },
      select: { roles: true },
    });
    if (user && !user.roles.includes("VENDOR")) {
      await prisma.user.update({
        where: { id: vendor.userId },
        data: { roles: [...user.roles, "VENDOR"] },
      });
    }
  }

  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/vendors/${vendorId}`);
}

/**
 * Từ chối vendor
 */
export async function rejectVendor(vendorId: string) {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "REJECTED" },
  });
  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/vendors/${vendorId}`);
}

/**
 * Cập nhật status vendor (PENDING, APPROVED, REJECTED, SUSPENDED)
 */
export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
) {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status },
  });

  // Nếu approve thì thêm role VENDOR
  if (status === "APPROVED") {
    const vendor = await prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      select: { userId: true },
    });
    if (vendor) {
      const user = await prisma.user.findUnique({
        where: { id: vendor.userId },
        select: { roles: true },
      });
      if (user && !user.roles.includes("VENDOR")) {
        await prisma.user.update({
          where: { id: vendor.userId },
          data: { roles: [...user.roles, "VENDOR"] },
        });
      }
    }
  }

  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/vendors/${vendorId}`);
}
