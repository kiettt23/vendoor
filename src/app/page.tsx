import { getFeaturedProducts } from "@/entities/product";
import { getCategoriesWithCount } from "@/entities/category";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  FlashDeals,
  FeaturedStores,
  PromoSection,
  BecomeSellerSection,
  TestimonialsSection,
  NewsletterSection,
} from "@/widgets/homepage";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategoriesWithCount(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FlashDeals />
      <FeaturedProducts products={featuredProducts} />
      <FeaturedStores />
      <PromoSection />
      <BecomeSellerSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
