"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { PriceDisplay } from "@/shared/ui/price-display";
import { EmptyWishlist } from "@/shared/ui/feedback";
import { calculateDiscount } from "@/entities/product";
import { removeFromWishlist } from "@/entities/wishlist";
import { MoveToCartButton } from "@/features/wishlist";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    image: string | null;
    isActive: boolean;
    stock: number;
    variantId: string;
    vendor: {
      id: string;
      name: string;
    };
  };
}

interface WishlistItemCardProps {
  item: WishlistItem;
  userId: string;
}

export function WishlistItemCard({ item, userId }: WishlistItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const { product } = item;

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromWishlist(userId, product.id);
    });
  };

  return (
    <Card className="group overflow-hidden p-0">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative bg-muted overflow-hidden">
          {product.image ? (
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {!product.isActive && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                Ngừng bán
              </span>
            </div>
          )}

          {calculateDiscount(product.price, product.compareAtPrice) && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2 font-medium"
            >
              -{calculateDiscount(product.price, product.compareAtPrice)}%
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link
          href={`/products/${product.slug}`}
          className="font-medium line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <p className="text-sm text-muted-foreground mt-1">
          {product.vendor.name}
        </p>

        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
          className="mt-2"
        />

        <div className="flex gap-2 mt-4">
          {product.isActive && product.stock > 0 ? (
            <MoveToCartButton
              product={{
                variantId: product.variantId,
                productSlug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                stock: product.stock,
                vendor: product.vendor,
              }}
              productId={product.id}
              className="flex-1"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled
            >
              {!product.isActive ? "Ngừng bán" : "Hết hàng"}
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface WishlistGridProps {
  items: WishlistItem[];
  userId: string;
}

export function WishlistGrid({ items, userId }: WishlistGridProps) {
  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} userId={userId} />
      ))}
    </div>
  );
}
