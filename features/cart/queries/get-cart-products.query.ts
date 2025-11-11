"use server";

import prisma from "@/server/db/prisma";
import { getSession } from "@/features/auth/index.server";
import type { CartProduct } from "../types/cart.types";

export async function getCartProducts(): Promise<CartProduct[]> {
  const { user } = await getSession();

  if (!user) {
    return [];
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { cart: true },
  });

  if (!dbUser || !dbUser.cart || Object.keys(dbUser.cart).length === 0) {
    return [];
  }

  const cartItems = dbUser.cart as Record<string, number>;
  const productIds = Object.keys(cartItems);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
    include: {
      store: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
    category: product.category,
    quantity: cartItems[product.id] || 0,
    store: product.store,
  }));
}
