"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/shared/lib/db";
import { ROUTES } from "@/shared/lib/constants";
import { requireSession } from "@/shared/lib/auth/session";
import type { Session } from "@/shared/lib/auth";

interface VendorUser {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
}

export interface VendorAuthResult {
  session: Session;
  user: VendorUser;
  vendorProfile: {
    id: string;
    shopName: string;
    status: string;
  };
}

export async function requireVendor(): Promise<VendorAuthResult> {
  const session = await requireSession();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
    },
  });

  if (!user || !user.roles.includes("VENDOR")) {
    redirect(ROUTES.HOME);
  }

  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      shopName: true,
      status: true,
    },
  });

  if (!vendorProfile || vendorProfile.status !== "APPROVED") {
    redirect(ROUTES.HOME);
  }

  return {
    session,
    user,
    vendorProfile,
  };
}
