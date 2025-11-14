import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatPrice, calculateDiscount } from "../lib/utils";

// ============================================
// TYPES
// ============================================

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  vendor: {
    name: string;
  };
  category: {
    name: string;
  };
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================

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
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={image || "/placeholder-product.png"}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Discount badge */}
            {discountPercent !== null && (
              <Badge variant="destructive" className="absolute right-2 top-2">
                -{discountPercent}%
              </Badge>
            )}

            {/* Category badge */}
            <Badge variant="secondary" className="absolute bottom-2 left-2">
              {category.name}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Vendor */}
            <p className="text-xs text-muted-foreground mb-1">{vendor.name}</p>

            {/* Product name */}
            <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </span>
              {discountPercent !== null && compareAtPrice && (
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
