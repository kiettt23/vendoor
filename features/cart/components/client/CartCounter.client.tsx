"use client";

import { useCart } from "@/features/cart/index.client";

interface CartCounterProps {
  productId: string;
}

export function CartCounter({ productId }: CartCounterProps) {
  const { items, updateQuantity, isPending } = useCart();
  const quantity = items[productId] || 0;

  const handleIncrease = () => {
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
      <button
        onClick={handleDecrease}
        className="p-1 select-none disabled:opacity-50"
        disabled={isPending || quantity <= 1}
      >
        -
      </button>
      <p className="p-1">{quantity}</p>
      <button
        onClick={handleIncrease}
        className="p-1 select-none disabled:opacity-50"
        disabled={isPending}
      >
        +
      </button>
    </div>
  );
}
