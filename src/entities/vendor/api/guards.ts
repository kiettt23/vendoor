"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { ROUTES } from "@/shared/lib/constants";
import { requireSession } from "@/shared/lib/auth/session";
import type { VendorAuthResult } from "../model/types";

export async function requireVendor(): Promise<VendorAuthResult> {
  const session = await requireSession();

  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      vendorProfile: {
        select: { id: true, shopName: true, status: true },
      },
    },
  });

  // Guard: Must be vendor with approved profile
  if (
    !data?.roles.includes("VENDOR") ||
    !data.vendorProfile ||
    data.vendorProfile.status !== "APPROVED"
  ) {
    redirect(ROUTES.HOME);
  }

  return {
    session,
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      roles: data.roles,
    },
    vendorProfile: data.vendorProfile,
  };
}
