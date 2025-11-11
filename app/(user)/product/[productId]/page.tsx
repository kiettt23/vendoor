import prisma from "@/server/db/prisma";
import {
  ProductDescription,
  ProductDetails,
} from "@/features/products/index.client";
import { vi } from "@/lib/i18n";
import { notFound } from "next/navigation";

// ✅ Server Component - Fetch product directly from DB
export default async function Product({ params }) {
  // ✅ Await params (Next.js 15)
  const { productId } = await params;

  // ✅ Fetch product directly from database
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      rating: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      store: {
        select: {
          id: true,
          name: true,
          username: true,
          logo: true,
        },
      },
    },
  });

  // ✅ Handle not found
  if (!product) {
    notFound();
  }

  return (
    <div className="mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-gray-600 text-sm mt-8 mb-5">
          {vi.nav.home} / {vi.admin.products} / {product.category}
        </div>

        {/* Product Details */}
        <ProductDetails product={product} />

        {/* Description & Reviews */}
        <ProductDescription product={product} />
      </div>
    </div>
  );
}
