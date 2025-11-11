"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/features/auth/index.server";

export async function getCart() {
  const { user } = await getSession();

  if (!user) {
    return { items: {}, total: 0 };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { cart: true },
  });

  const items = (dbUser?.cart as Record<string, number>) || {};
  const total = Object.values(items).reduce((sum, qty) => sum + qty, 0);

  return { items, total };
}
