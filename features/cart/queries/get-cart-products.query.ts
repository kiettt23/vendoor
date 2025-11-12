"use server";

import { getSession } from "@/features/auth/index.server";
import { cartService } from "../lib/cart.service";
import type { CartProduct } from "@/features/cart/types/cart.types";

export async function getCartProducts(): Promise<CartProduct[]> {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return [];
  }

  const { cart, products } = await cartService.getCartWithProducts(user.id);

  if (!products || products.length === 0) {
    return [];
  }

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
    category: product.category,
    quantity: cart[product.id] || 0,
    store: product.store!,
  }));
}
