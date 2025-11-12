import { BestSelling } from "@/features/products/index.server";
import Hero from "@/shared/layouts/Hero";
import Newsletter from "@/shared/layouts/marketing/Newsletter";
import OurSpec from "@/shared/layouts/marketing/OurSpec";
import { LatestProducts } from "@/features/products/index.server";
import prisma from "@/server/db/prisma";

// ✅ Server Component - Fetch products for homepage
export default async function Home() {
  // ✅ Fetch products directly from database
  const products = await prisma.product.findMany({
    where: {
      inStock: true,
      store: {
        isActive: true,
      },
    },
    include: {
      rating: true,
      store: {
        select: {
          name: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <Hero />
      <LatestProducts products={products} />
      <BestSelling products={products} />
      <OurSpec />
      <Newsletter />
    </div>
  );
}
