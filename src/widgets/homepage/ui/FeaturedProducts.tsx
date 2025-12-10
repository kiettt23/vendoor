import Link from "next/link";
import { ProductCard, type FeaturedProduct, calculateAverageRating } from "@/entities/product";
import { ROUTES } from "@/shared/lib/constants";
import { ArrowUpRight } from "lucide-react";

interface FeaturedProductsProps {
  products: FeaturedProduct[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const formatted = products.map((p) => {
    const reviewCount = p.reviews.length;
    const avgRating = calculateAverageRating(p.reviews);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.variants[0]?.price || 0,
      compareAtPrice: p.variants[0]?.compareAtPrice || null,
      image: p.images[0]?.url || "",
      stock: p.variants[0]?.stock ?? 0,
      variantId: p.variants[0]?.id || "",
      vendor: {
        id: p.vendor.id,
        shopName: p.vendor.vendorProfile?.shopName || "Vendoor",
      },
      category: { name: p.category.name, slug: p.category.slug },
      rating: avgRating,
      reviewCount,
    };
  });

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold">Sản phẩm nổi bật</h2>
            <p className="text-muted-foreground mt-2">
              Được khách hàng yêu thích nhất tuần này
            </p>
          </div>
          <Link
            href={ROUTES.PRODUCTS}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Xem tất cả
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {formatted.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
