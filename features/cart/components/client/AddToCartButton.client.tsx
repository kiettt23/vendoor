"use client";

import { useCart } from "@/features/cart/index.client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/index.client";
import vi from "@/lib/i18n";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { items, addToCart: addToCartHandler, isPending } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const isInCart = !!items[productId];

  const handleClick = () => {
    if (!session) {
      router.push("/sign-in");
      return;
    }

    if (!isInCart) {
      addToCartHandler(productId);
    } else {
      router.push("/cart");
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-primary text-white"
      disabled={isPending}
    >
      {!isInCart ? vi.product.addToCart : "Xem giỏ hàng"}
    </Button>
  );
}
