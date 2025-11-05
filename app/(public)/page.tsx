import BestSelling from "@/components/features/product/BestSelling";
import Hero from "@/components/layout/Hero";
import Newsletter from "@/components/features/marketing/Newsletter";
import OurSpec from "@/components/features/marketing/OurSpec";
import LatestProducts from "@/components/features/product/LatestProducts";
import prisma from "@/lib/prisma";

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
