"use client";
import { useCart } from "@/features/cart/hooks/useCart";

interface CounterProps {
  productId: string;
}

const Counter = ({ productId }: CounterProps) => {
  const { items, addToCart, removeItem } = useCart();

  const addToCartHandler = () => {
    addToCart(productId);
  };

  const removeFromCartHandler = () => {
    removeItem(productId);
  };

  return (
    <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
      <button onClick={removeFromCartHandler} className="p-1 select-none">
        -
      </button>
      <p className="p-1">{items[productId]}</p>
      <button onClick={addToCartHandler} className="p-1 select-none">
        +
      </button>
    </div>
  );
};

export default Counter;
