import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "./utils";
import { isAdmin, isSeller } from "./authorization";
import type { AuthUser, SellerWithStore, StoreInfo } from "./types";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?error=auth_required");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isAdmin(user)) {
    redirect("/?error=admin_required");
  }
  return user;
}

export async function requireSeller(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isSeller(user)) {
    redirect("/create-store?error=seller_required");
  }
  return user;
}

export async function requireSellerWithStore(): Promise<SellerWithStore> {
  const user = await requireSeller();

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

  if (!store) {
    redirect("/create-store?error=no_store");
  }

  if (store.status !== "approved") {
    redirect("/create-store?error=store_pending");
  }

  if (!store.isActive) {
    redirect("/create-store?error=store_disabled");
  }

  return {
    user,
    storeId: store.id,
    storeInfo: store as StoreInfo,
  };
}
