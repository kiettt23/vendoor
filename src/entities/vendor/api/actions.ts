"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/shared/lib/db";
import { REVALIDATION_PATHS, CACHE_TAGS } from "@/shared/lib/constants";
import type { VendorStatus } from "@/generated/prisma";

// ============================================================================
// Helper Functions
// ============================================================================

async function addVendorRoleToUser(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: true },
  });

  if (user && !user.roles.includes("VENDOR")) {
    await prisma.user.update({
      where: { id: userId },
      data: { roles: [...user.roles, "VENDOR"] },
    });
  }
}

/** Revalidate tất cả vendor-related caches */
function revalidateVendorCaches(vendorId: string, slug?: string): void {
  revalidateTag(CACHE_TAGS.VENDORS, "max");
  revalidateTag(CACHE_TAGS.ADMIN_VENDORS, "max");
  revalidateTag(CACHE_TAGS.ADMIN_STATS, "max");
  if (slug) {
    revalidateTag(CACHE_TAGS.VENDOR(slug), "max");
  }
  REVALIDATION_PATHS.ADMIN_VENDORS(vendorId).forEach((p) => revalidatePath(p));
}

/** Revalidate chỉ admin caches (cho reject) */
function revalidateAdminVendorCaches(vendorId: string): void {
  revalidateTag(CACHE_TAGS.ADMIN_VENDORS, "max");
  revalidateTag(CACHE_TAGS.ADMIN_STATS, "max");
  REVALIDATION_PATHS.ADMIN_VENDORS(vendorId).forEach((p) => revalidatePath(p));
}

// ============================================================================
// Public Actions (Form-compatible - return void for use with form action)
// ============================================================================

export async function approveVendor(vendorId: string): Promise<void> {
  const vendor = await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "APPROVED" },
    select: { userId: true, slug: true },
  });

  if (vendor) {
    await addVendorRoleToUser(vendor.userId);
  }

  revalidateVendorCaches(vendorId, vendor?.slug);
}

export async function rejectVendor(vendorId: string): Promise<void> {
  await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status: "REJECTED" },
  });

  revalidateAdminVendorCaches(vendorId);
}

export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
): Promise<void> {
  const vendor = await prisma.vendorProfile.update({
    where: { id: vendorId },
    data: { status },
    select: { userId: true, slug: true },
  });

  if (status === "APPROVED" && vendor) {
    await addVendorRoleToUser(vendor.userId);
  }

  revalidateVendorCaches(vendorId, vendor?.slug);
}
