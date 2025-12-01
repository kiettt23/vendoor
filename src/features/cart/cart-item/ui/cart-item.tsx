"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { useCart } from "@/entities/cart";
import type {
  CartItem as CartItemType,
  StockValidationItem,
} from "@/entities/cart";
import { formatPrice } from "@/shared/lib";

interface CartItemProps {
  item: CartItemType;
  stockValidation?: StockValidationItem;
}

export function CartItemCard({ item, stockValidation }: CartItemProps) {
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (qty: number) => {
    setIsUpdating(true);
    updateQuantity(item.id, qty);
    setTimeout(() => setIsUpdating(false), 300);
  };

  const hasStockIssue = stockValidation && !stockValidation.isAvailable;
  const actualStock = stockValidation?.availableStock ?? item.stock;
  const isOutOfStock = actualStock === 0;

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg border ${
        hasStockIssue
          ? "border-orange-500 border-2 bg-orange-50/50"
          : "border-border bg-muted/30"
      }`}
    >
      <Link
        href={`/products/${item.productSlug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md"
      >
        <Image
          src={item.image}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link
            href={`/products/${item.productSlug}`}
            className="font-medium hover:text-primary line-clamp-1"
          >
            {item.productName}
          </Link>
          {item.variantName && (
            <Badge variant="outline" className="mt-1">
              {item.variantName}
            </Badge>
          )}
          <p className="mt-1 text-lg font-semibold text-primary">
            {formatPrice(item.price)}
          </p>
        </div>

        {hasStockIssue && (
          <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>{stockValidation.message}</span>
          </div>
        )}
        {!hasStockIssue && isOutOfStock && (
          <p className="text-sm text-destructive font-medium">Hết hàng</p>
        )}
        {!hasStockIssue && !isOutOfStock && (
          <p className="text-sm text-muted-foreground">
            Còn {actualStock} sản phẩm
          </p>
        )}
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdate(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleUpdate(item.quantity + 1)}
            disabled={
              isUpdating || item.quantity >= actualStock || isOutOfStock
            }
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm">
          <span className="font-semibold">
            {formatPrice(item.price * item.quantity)}
          </span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          disabled={isUpdating}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Xóa
        </Button>
      </div>
    </div>
  );
}
