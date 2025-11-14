"use client";

import type { CartItem } from "../types";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/features/product/lib/utils";

// ============================================
// TYPES
// ============================================

interface CartItemComponentProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Cart item card component
 * - Display product info, variant, quantity controls
 * - Remove button
 *
 * TODO: Implement full UI with Shadcn components
 */
export function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemComponentProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-20 h-20">
          <Image
            src={item.image}
            alt={item.productName}
            fill
            className="object-cover rounded"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <Link
            href={`/products/${item.productSlug}`}
            className="font-semibold hover:underline"
          >
            {item.productName}
          </Link>
          {item.variantName && (
            <Badge variant="outline" className="mt-1">
              {item.variantName}
            </Badge>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Remove */}
        <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
