"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Loader2, Eye } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import { useCart } from "@/entities/cart";
import { calculateDiscount } from "../lib/utils";
import type { ProductListItem } from "../model/types";

type ProductCardProps = ProductListItem;

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  vendor,
  category,
}: ProductCardProps) {
  const discountPercent = calculateDiscount(price, compareAtPrice);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (isAdding || isAdded) return;

    setIsAdding(true);

    addItem({
      productId: id,
      productName: name,
      productSlug: slug,
      variantId: `${id}-default`, // Default variant
      variantName: "Mặc định",
      price,
      quantity: 1,
      image: image || "/placeholder.jpg",
      stock: 99, // Will be checked on checkout
      vendorId: vendor.id,
      vendorName: vendor.name,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 p-0">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={image || "/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Quick actions overlay */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform">
              <div className="flex gap-1 p-2 bg-black/60 backdrop-blur">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 h-9"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Chi tiết
                </Button>
                <Button
                  size="sm"
                  variant={isAdded ? "default" : "default"}
                  className={`flex-1 h-9 ${
                    isAdded ? "bg-green-600 hover:bg-green-600" : ""
                  }`}
                  onClick={handleQuickAdd}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isAdded ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Đã thêm
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Thêm
                    </>
                  )}
                </Button>
              </div>
            </div>

            {discountPercent && (
              <Badge
                variant="destructive"
                className="absolute right-2 top-2 font-bold"
              >
                -{discountPercent}%
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 bg-white/95 text-xs group-hover:opacity-0 transition-opacity"
            >
              {category.name}
            </Badge>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {vendor.name}
            </p>
            <h3 className="line-clamp-2 font-semibold group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex-1" />
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </span>
              {compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
