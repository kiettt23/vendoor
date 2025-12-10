"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { ArrowUpRight, Clock, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { formatPrice } from "@/shared/lib";
import { ROUTES } from "@/shared/lib/constants";
import type { FlashSaleProduct } from "@/entities/product";

interface FlashDealsProps {
  products: FlashSaleProduct[];
}

export function FlashDeals({ products }: FlashDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 32,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-linear-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl lg:text-3xl font-bold text-primary">
                Flash Sale
              </span>
              <Badge variant="destructive" className="animate-pulse">
                HOT
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <span className="bg-foreground text-background px-2 py-1 rounded font-mono font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-foreground text-background px-2 py-1 rounded font-mono font-bold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span>:</span>
                <span className="bg-foreground text-background px-2 py-1 rounded font-mono font-bold">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
          <Link
            href={ROUTES.FLASH_SALE}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all"
            >
              <div className="relative aspect-square p-4 bg-secondary/30">
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  -{product.discountPercent}%
                </Badge>
                <OptimizedImage
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground">{product.store}</p>
                <h3 className="font-semibold text-sm line-clamp-2 h-10">
                  {product.name}
                </h3>
                <div>
                  <span className="font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through ml-2">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress
                    value={(product.sold / product.total) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Đã bán {product.sold}/{product.total}
                  </p>
                </div>
                <Button className="w-full gap-2" size="sm" asChild>
                  <Link href={`/products/${product.slug}`}>
                    <ShoppingCart className="h-4 w-4" />
                    Mua ngay
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
