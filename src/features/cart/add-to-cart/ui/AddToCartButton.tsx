"use client";

import { useState, useEffect, useRef } from "react";
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
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleClick = () => {
    if (disabled || status === "adding") return;

    // Clear any existing timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];

    setStatus("adding");
    addItem({ ...item, quantity });

    const t1 = setTimeout(() => {
      setStatus("added");
      const t2 = setTimeout(() => {
        setStatus("idle");
      }, 2000);
      timeoutsRef.current.push(t2);
    }, 300);
    timeoutsRef.current.push(t1);
  };

  const isDisabled = disabled || item.stock === 0 || status === "adding";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isDisabled}
      className={className}
    >
      {status === "adding" ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang thêm...
        </>
      ) : status === "added" ? (
        <>
          <Check className="mr-2 h-4 w-4" /> Đã thêm!
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />{" "}
          {item.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </>
      )}
    </Button>
  );
}
