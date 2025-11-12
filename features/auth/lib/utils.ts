import { headers } from "next/headers";
import { auth } from "./config";
import prisma from "@/server/db/prisma";
import type { AuthUser, SellerStoreResult, StoreStatus } from "./types";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email ?? undefined,
    username: session.user.username ?? undefined,
    role: session.user.role ?? undefined,
    name: session.user.name ?? undefined,
    image: session.user.image ?? undefined,
  };
}

export async function getSellerStore(): Promise<SellerStoreResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { isSeller: false, storeInfo: null };
    }

    const store = await prisma.store.findUnique({
      where: { userId: user.id },
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

    return {
      isSeller: true,
      storeInfo: {
        id: store.id,
        name: store.name,
        username: store.username,
        logo: store.logo,
        status: store.status as StoreStatus,
        isActive: store.isActive,
      },
    };
  } catch (error) {
    console.error("Error fetching seller store:", error);
    return { isSeller: false, storeInfo: null };
  }
}
