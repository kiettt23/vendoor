import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import { calculateDiscount } from "../lib/utils";
import type { ProductListItem } from "../model/types";

interface ProductCardProps extends ProductListItem {}

export function ProductCard({
  name,
  slug,
  price,
  compareAtPrice,
  image,
  vendor,
  category,
}: ProductCardProps) {
  const discountPercent = calculateDiscount(price, compareAtPrice);

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={image || "/placeholder-product.png"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform">
              <div className="bg-primary/90 backdrop-blur px-4 py-2.5 text-center">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Xem chi tiết</span>
                </div>
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
              className="absolute bottom-2 left-2 bg-white/95 text-xs"
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
