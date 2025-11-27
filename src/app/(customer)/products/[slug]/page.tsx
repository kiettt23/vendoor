import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Store, ShoppingCart } from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  ProductCard,
  calculateDiscount,
} from "@/entities/product";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Vendoor`,
    description: product.description || `Mua ${product.name}`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(
    product.category.id,
    product.id
  );
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const discountPercent = calculateDiscount(
    defaultVariant.price,
    defaultVariant.compareAtPrice
  );

  return (
    <div className="container mx-auto py-12 lg:py-16 px-4">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground">
          Sản phẩm
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate">
          {product.name}
        </span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images[0] && (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
            {discountPercent && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                -{discountPercent}%
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded overflow-hidden bg-muted"
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Link
              href={`/shop/${product.vendor.slug}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <Store className="h-4 w-4" />
              {product.vendor.shopName}
            </Link>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(defaultVariant.price)}
            </span>
            {defaultVariant.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(defaultVariant.compareAtPrice)}
              </span>
            )}
          </div>

          {product.variants.length > 1 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Phân loại</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <Badge
                      key={v.id}
                      variant={v.isDefault ? "default" : "outline"}
                      className="cursor-pointer"
                    >
                      {v.name || "Mặc định"} - {formatPrice(v.price)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span
              className={
                defaultVariant.stock > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {defaultVariant.stock > 0
                ? `Còn ${defaultVariant.stock} sản phẩm`
                : "Hết hàng"}
            </span>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={defaultVariant.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {defaultVariant.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </Button>
        </div>
      </div>

      {product.description && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Mô Tả</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      )}

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
