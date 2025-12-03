import { notFound } from "next/navigation";
import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Store } from "lucide-react";
import { headers } from "next/headers";
import {
  getProductBySlug,
  getRelatedProducts,
  ProductCard,
  calculateDiscount,
} from "@/entities/product";
import {
  getProductReviews,
  getProductReviewStats,
  hasUserReviewed,
  StarRating,
} from "@/entities/review";
import { isInWishlist } from "@/entities/wishlist";
import { Badge } from "@/shared/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { auth } from "@/shared/lib/auth";
import { ReviewList, WriteReviewForm } from "@/features/review";
import { WishlistButton } from "@/features/wishlist";
import { ProductDetailWithCart, ProductCardActions } from "@/features/cart";

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

  // Fetch related data in parallel
  const [relatedProducts, reviewStats, reviews, session] = await Promise.all([
    getRelatedProducts(product.category.id, product.id),
    getProductReviewStats(product.id),
    getProductReviews(product.id, { limit: 5 }),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const userId = session?.user?.id;
  const [userHasReviewed, productInWishlist] = await Promise.all([
    userId ? hasUserReviewed(userId, product.id) : false,
    userId ? isInWishlist(userId, product.id) : false,
  ]);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];
  const discountPercent = calculateDiscount(
    defaultVariant.price,
    defaultVariant.compareAtPrice
  );

  return (
    <div className="container mx-auto py-12 lg:py-16 px-4">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">Sản phẩm</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/products?category=${product.category.slug}`}>
                {product.category.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate max-w-[200px]">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.images[0] && (
              <OptimizedImage
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
                  <OptimizedImage src={img.url} alt="" fill className="object-cover" />
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

            {/* Rating summary */}
            {reviewStats.totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={reviewStats.averageRating} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {reviewStats.averageRating.toFixed(1)} (
                  {reviewStats.totalReviews} đánh giá)
                </span>
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <WishlistButton
            productId={product.id}
            userId={userId || null}
            initialIsInWishlist={productInWishlist}
            variant="button"
          />

          <ProductDetailWithCart
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
            }}
            vendor={{
              vendorProfileId: product.vendor.vendorProfileId,
              shopName: product.vendor.shopName,
            }}
            variants={product.variants}
            defaultVariant={defaultVariant}
            image={product.images[0]?.url || ""}
          />
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

      {/* Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Đánh Giá Sản Phẩm</h2>

        <ReviewList reviews={reviews.reviews} stats={reviewStats} />

        {/* Write review form */}
        {userId && !userHasReviewed && (
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">
              Viết đánh giá của bạn
            </h3>
            <WriteReviewForm productId={product.id} userId={userId} />
          </div>
        )}

        {!userId && (
          <div className="mt-8 text-center py-6 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>{" "}
              để viết đánh giá
            </p>
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-8">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                {...p}
                renderActions={(props) => <ProductCardActions {...props} />}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
