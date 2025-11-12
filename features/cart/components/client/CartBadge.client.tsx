"use client";

import { useCart } from "../../hooks/useCart";

export function CartBadge() {
  const { total, isLoading } = useCart();

  if (isLoading) return null;

  if (total === 0) return null;

  return (
    <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
      {total}
    </span>
  );
}
