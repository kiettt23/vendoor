import { getCartProducts } from "@/features/cart/index.server";
import { CartClient } from "@/features/cart/index.client";

export default async function Cart() {
  const products = await getCartProducts();

  return <CartClient products={products} />;
}
