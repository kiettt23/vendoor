"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { REVALIDATION_PATHS } from "@/shared/lib/constants";

import type { VendorStatus } from "@/generated/prisma";

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

  REVALIDATION_PATHS.ADMIN_VENDORS(vendorId).forEach(p => revalidatePath(p));
}

export async function rejectVendor(vendorId: string) {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "REJECTED" },
  });
  REVALIDATION_PATHS.ADMIN_VENDORS(vendorId).forEach(p => revalidatePath(p));
}

export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
) {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status },
  });

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

  REVALIDATION_PATHS.ADMIN_VENDORS(vendorId).forEach(p => revalidatePath(p));
}
