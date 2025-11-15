"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { CartItem as CartItemType, StockValidationItem } from "../types";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "@/features/product/lib/utils";

// ============================================
// TYPES
// ============================================

interface CartItemProps {
  item: CartItemType;
  stockValidation?: StockValidationItem; // From React Query
}

// ============================================
// COMPONENT
// ============================================

/**
 * CartItem - Single cart item with controls
 *
 * Features:
 * - Product info display
 * - Quantity controls (+/-)
 * - Remove button
 * - Stock warning (if validation fails)
 * - Client validation (fast UX)
 * - Optimistic UI updates
 *
 * Architecture:
 * - Connected to Zustand (useCart)
 * - Receives server validation from parent
 * - Hybrid validation (Q1 decision)
 */
export function CartItem({ item, stockValidation }: CartItemProps) {
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const [isUpdating, setIsUpdating] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleUpdateQuantity = (newQuantity: number) => {
    setIsUpdating(true);
    updateQuantity(item.id, newQuantity);

    // Reset UI state after animation
    setTimeout(() => setIsUpdating(false), 300);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Stock warning states
  const hasStockIssue = stockValidation && !stockValidation.isAvailable;
  const actualStock = stockValidation?.availableStock ?? item.stock;
  const isLowStock = actualStock > 0 && actualStock < 5;
  const isOutOfStock = actualStock === 0;

  // Disable controls
  const isDecrementDisabled = isUpdating || item.quantity <= 1;
  const isIncrementDisabled =
    isUpdating || item.quantity >= actualStock || isOutOfStock;

  return (
    <Card className={hasStockIssue ? "border-orange-500 border-2" : ""}>
      <CardContent className="flex gap-4 p-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.productSlug}`}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md hover:opacity-80 transition-opacity"
        >
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="96px"
          />
        </Link>

        {/* Product Info */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium hover:text-primary transition-colors line-clamp-1"
            >
              {item.productName}
            </Link>

            {/* Variant */}
            {item.variantName && (
              <Badge variant="outline" className="mt-1">
                {item.variantName}
              </Badge>
            )}

            {/* Price */}
            <p className="mt-1 text-lg font-semibold text-primary">
              {formatPrice(item.price)}
            </p>
          </div>

          {/* Stock Warnings */}
          {hasStockIssue && (
            <div className="flex items-center gap-1 text-sm text-orange-600 font-medium">
              <AlertTriangle className="h-4 w-4" />
              <span>{stockValidation.message}</span>
            </div>
          )}

          {!hasStockIssue && isOutOfStock && (
            <p className="text-sm text-destructive font-medium">Hết hàng</p>
          )}

          {!hasStockIssue && isLowStock && (
            <p className="text-sm text-orange-600">
              Chỉ còn {actualStock} sản phẩm
            </p>
          )}
        </div>

        {/* Controls Column */}
        <div className="flex flex-col items-end justify-between gap-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={isDecrementDisabled}
              aria-label="Giảm số lượng"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-10 text-center font-medium tabular-nums">
              {item.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isIncrementDisabled}
              aria-label="Tăng số lượng"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Subtotal */}
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatPrice(item.price * item.quantity)}
            </span>
          </p>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Xóa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
