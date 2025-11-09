/**
 * Auth Guards
 *
 * Strict functions that throw errors if conditions not met
 * Use in server actions and API routes
 */

import prisma from "@/lib/prisma";
import { getCurrentUser, hasRole } from "./utils";
import type { SellerWithStore } from "./types";

// Require authenticated user
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized - Login required");
  }

  return user;
}

// Require specific role(s)
export async function requireRole(roles: string | string[]) {
  const user = await requireAuth();

  if (!hasRole(user, roles)) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    throw new Error(`Forbidden - Required role(s): ${roleArray.join(", ")}`);
  }

  return user;
}

// Require ADMIN role
export async function requireAdmin() {
  const user = await requireAuth();

  if (!hasRole(user, "ADMIN")) {
    throw new Error("Forbidden - Admin access required");
  }

  return user;
}

// Require SELLER or ADMIN role
export async function requireSeller() {
  const user = await requireAuth();

  if (!hasRole(user, ["SELLER", "ADMIN"])) {
    throw new Error("Forbidden - Seller access required");
  }

  return user;
}

// Require seller with approved store
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
