"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCart } from "@/entities/cart";
import type { CartItem } from "@/entities/cart";

interface AddToCartButtonProps {
  item: Omit<CartItem, "id" | "quantity">;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function AddToCartButton({
  item,
  quantity = 1,
  disabled = false,
  className,
  variant = "default",
  size = "default",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleClick = () => {
    if (disabled || isAdding) return;
    setIsAdding(true);
    addItem({ ...item, quantity });
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  const isDisabled = disabled || item.stock === 0 || isAdding;

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={isDisabled} className={className}>
      {isAdding ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang thêm...</>
      ) : isAdded ? (
        <><Check className="mr-2 h-4 w-4" /> Đã thêm!</>
      ) : (
        <><ShoppingCart className="mr-2 h-4 w-4" /> {item.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}</>
      )}
    </Button>
  );
}

