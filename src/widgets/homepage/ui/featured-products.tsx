import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { ProductCard } from "@/entities/product";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  vendor: { id: string; name: string | null };
  variants: { price: number; compareAtPrice: number | null }[];
  images: { url: string }[];
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const formatted = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.variants[0]?.price || 0,
    compareAtPrice: p.variants[0]?.compareAtPrice || null,
    image: p.images[0]?.url || "",
    vendor: { id: p.vendor.id, name: p.vendor.name || "Unknown" },
    category: { name: "Sản phẩm", slug: "" },
  }));

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Sản Phẩm Nổi Bật</h2>
            <p className="text-muted-foreground">Những sản phẩm được yêu thích nhất</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">Xem tất cả <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formatted.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}

