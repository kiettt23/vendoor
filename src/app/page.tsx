import { prisma } from "@/shared/lib/db/prisma";
import { HeroSection, CategoriesSection, FeaturedProducts } from "@/widgets/homepage";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: {
      vendor: { select: { id: true, name: true } },
      variants: { where: { isDefault: true }, select: { price: true, compareAtPrice: true } },
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts} />
    </>
  );
}
