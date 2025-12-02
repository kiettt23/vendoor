import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import { requireAuth } from "@/entities/user";

import { getUserWishlist, removeFromWishlist } from "@/entities/wishlist";

export const metadata = {
  title: "Danh sách yêu thích",
  description: "Các sản phẩm bạn đã lưu vào danh sách yêu thích",
};

export default async function WishlistPage() {
  const { user } = await requireAuth();
  const items = await getUserWishlist(user.id);

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Chưa có sản phẩm yêu thích</h1>
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
    <div className="container mx-auto py-8 px-4 max-w-6xl min-h-[60vh]">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <h1 className="text-3xl font-bold">Yêu thích ({items.length})</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <WishlistItemCard key={item.id} item={item} userId={user.id} />
        ))}
      </div>
    </div>
  );
}

interface WishlistItemCardProps {
  item: Awaited<ReturnType<typeof getUserWishlist>>[number];
  userId: string;
}

async function WishlistItemCard({ item, userId }: WishlistItemCardProps) {
  const { product } = item;

  async function handleRemove() {
    "use server";
    await removeFromWishlist(userId, product.id);
  }

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative bg-muted overflow-hidden">
          {product.image ? (
            <Image
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
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
            disabled={!product.isActive || product.stock === 0}
          >
            <Link href={`/products/${product.slug}`}>
              {product.stock === 0 ? "Hết hàng" : "Xem chi tiết"}
            </Link>
          </Button>

          <form action={handleRemove}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
