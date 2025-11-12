import { redirect } from "next/navigation";
import prisma from "@/shared/configs/prisma";
import { getCurrentUser } from "./utils";
import { isAdmin, isSeller } from "./authorization";
import { AUTH_ROUTES, AUTH_ERROR_PARAMS } from "./constants";
import type { AuthUser, SellerWithStore, StoreInfo } from "./types";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`${AUTH_ROUTES.SIGN_IN}?error=${AUTH_ERROR_PARAMS.AUTH_REQUIRED}`);
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isAdmin(user)) {
    redirect(`${AUTH_ROUTES.HOME}?error=${AUTH_ERROR_PARAMS.ADMIN_REQUIRED}`);
  }
  return user;
}

export async function requireSeller(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isSeller(user)) {
    redirect(
      `${AUTH_ROUTES.CREATE_STORE}?error=${AUTH_ERROR_PARAMS.SELLER_REQUIRED}`
    );
  }
  return user;
}

export async function requireSellerWithStore(): Promise<SellerWithStore> {
  const user = await requireSeller();

  if (!user) {
    redirect(`${AUTH_ROUTES.SIGN_IN}?error=${AUTH_ERROR_PARAMS.AUTH_REQUIRED}`);
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

  if (!store) {
    redirect(`${AUTH_ROUTES.CREATE_STORE}?error=${AUTH_ERROR_PARAMS.NO_STORE}`);
  }

  if (store.status !== "approved") {
    redirect(
      `${AUTH_ROUTES.CREATE_STORE}?error=${AUTH_ERROR_PARAMS.STORE_PENDING}`
    );
  }

  if (!store.isActive) {
    redirect(
      `${AUTH_ROUTES.CREATE_STORE}?error=${AUTH_ERROR_PARAMS.STORE_DISABLED}`
    );
  }

  return {
    user,
    storeId: store.id,
    storeInfo: store as StoreInfo,
  };
}
