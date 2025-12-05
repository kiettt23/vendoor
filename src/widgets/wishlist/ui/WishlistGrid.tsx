"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
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

          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
            </div>
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

        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

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
    return (
      <div className="text-center py-16">
        <Heart className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-2">Chưa có sản phẩm yêu thích</h2>
        <p className="text-muted-foreground mb-8">
          Hãy thêm sản phẩm vào danh sách yêu thích để theo dõi
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Khám phá sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} userId={userId} />
      ))}
    </div>
  );
}
