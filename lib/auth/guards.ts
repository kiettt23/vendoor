/**
 * Auth Guards - Server-side authorization
 *
 * Throw lỗi nếu điều kiện không được thỏa mãn
 * Chỉ sử dụng trong Server Actions và API Routes
 */

import prisma from "@/lib/prisma";
import { getCurrentUser } from "./utils";
import { isAdmin, isSeller } from "./authorization";
import type { AuthUser, SellerWithStore } from "./types";

// Yêu cầu user đã đăng nhập
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized - Login required");
  }
  return user;
}

// Yêu cầu quyền admin
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isAdmin(user)) {
    throw new Error("Forbidden - Admin access required");
  }
  return user;
}

// Yêu cầu quyền seller (CHỈ SELLER, không bao gồm admin)
export async function requireSeller(): Promise<AuthUser> {
  const user = await requireAuth();
  if (!isSeller(user)) {
    throw new Error(
      "Forbidden - Seller access required. Please register a store first."
    );
  }
  return user;
}

// Yêu cầu seller có cửa hàng đã được duyệt
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
    throw new Error("Store not found - Please create a store first");
  }

  if (store.status !== "approved") {
    throw new Error(`Store not approved - Current status: ${store.status}`);
  }

  if (!store.isActive) {
    throw new Error("Store is inactive - Please contact support");
  }

  return {
    user,
    storeId: store.id,
    storeInfo: store,
  };
}
