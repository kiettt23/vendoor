"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { OptimizedImage } from "@/shared/ui/optimized-image";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleUpdate = (qty: number) => {
    setIsUpdating(true);
    updateQuantity(item.id, qty);
    timeoutRef.current = setTimeout(() => setIsUpdating(false), 300);
  };

  const hasStockIssue = stockValidation && !stockValidation.isAvailable;
  const actualStock = stockValidation?.availableStock ?? item.stock;
  const isOutOfStock = actualStock === 0;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border ${
        hasStockIssue
          ? "border-orange-500 border-2 bg-orange-50/50"
          : "border-border bg-muted/30"
      }`}
    >
      {/* Mobile: Row with image + info, Desktop: Same */}
      <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md"
        >
          <OptimizedImage
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
        </Link>

        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium hover:text-primary line-clamp-2 sm:line-clamp-1 text-sm sm:text-base"
            >
              {item.productName}
            </Link>
            {item.variantName && (
              <Badge variant="outline" className="mt-1 text-xs">
                {item.variantName}
              </Badge>
            )}
            <p className="mt-1 text-base sm:text-lg font-semibold text-primary">
              {formatPrice(item.price)}
            </p>
          </div>

          {hasStockIssue && (
            <div className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 font-medium">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{stockValidation.message}</span>
            </div>
          )}
          {!hasStockIssue && isOutOfStock && (
            <p className="text-xs sm:text-sm text-destructive font-medium">Hết hàng</p>
          )}
          {!hasStockIssue && !isOutOfStock && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Còn {actualStock} sản phẩm
            </p>
          )}
        </div>
      </div>

      {/* Mobile: Bottom row with controls, Desktop: Right column */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => handleUpdate(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="w-8 sm:w-10 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => handleUpdate(item.quantity + 1)}
            disabled={
              isUpdating || item.quantity >= actualStock || isOutOfStock
            }
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <p className="text-sm sm:text-base">
          <span className="font-semibold">
            {formatPrice(item.price * item.quantity)}
          </span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeItem(item.id)}
          disabled={isUpdating}
          className="text-destructive hover:text-destructive h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Xóa
        </Button>
      </div>
    </div>
  );
}
