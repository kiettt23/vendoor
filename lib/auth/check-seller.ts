"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface StoreInfo {
  id: string;
  name: string;
  username: string;
  logo: string | null;
  status: string;
  isActive: boolean;
}

interface SellerCheckResult {
  isSeller: boolean;
  storeInfo: StoreInfo | null;
}

export async function checkIsSeller(): Promise<SellerCheckResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { isSeller: false, storeInfo: null };
    }

    const store = await prisma.store.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        username: true,
        logo: true,
        status: true,
        isActive: true,
      },
    });

    // Check if store exists and is approved & active
    if (!store || store.status !== "approved" || !store.isActive) {
      return { isSeller: false, storeInfo: null };
    }

    return { isSeller: true, storeInfo: store };
  } catch (error) {
    console.error("Error checking seller status:", error);
    return { isSeller: false, storeInfo: null };
  }
}

export async function requireSeller(): Promise<string> {
  const { isSeller, storeInfo } = await checkIsSeller();

  if (!isSeller || !storeInfo) {
    throw new Error("Unauthorized: Approved store required");
  }

  return storeInfo.id;
}
