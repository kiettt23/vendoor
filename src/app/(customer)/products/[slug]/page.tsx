import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/product/actions/get-product-detail";
import { ProductImages } from "@/features/product/components/ProductImages";
import { ProductInfo } from "@/features/product/components/ProductInfo";
import { ProductCard } from "@/features/product/components/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// ============================================
// PAGE PROPS
// ============================================

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ============================================
// GENERATE METADATA
// ============================================

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Vendoor`,
    description: product.description || `Mua ${product.name} tại Vendoor`,
  };
}

// ============================================
// PRODUCT DETAIL PAGE
// ============================================

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = await getRelatedProducts(
    product.category.id,
    product.id
  );

  // Get default variant
  const defaultVariant =
    product.variants.find((v) => v.isDefault) || product.variants[0];

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Images */}
        <ProductImages images={product.images} productName={product.name} />

        {/* Right: Info & Actions */}
        <ProductInfo product={product} defaultVariant={defaultVariant} />
      </div>

      {/* Description */}
      {product.description && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Mô Tả Sản Phẩm</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
