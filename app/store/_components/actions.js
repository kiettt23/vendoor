"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function checkIsSeller() {
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

    if (!store || store.status !== "approved" || !store.isActive) {
      return { isSeller: false, storeInfo: null };
    }

    return { isSeller: true, storeInfo: store };
  } catch (error) {
    console.error("Error checking seller status:", error);
    return { isSeller: false, storeInfo: null };
  }
}
