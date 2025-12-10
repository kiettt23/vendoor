import {
  getFeaturedProducts,
  getFlashSaleProducts,
} from "@/entities/product/api/queries";
import { getCategoriesWithCount } from "@/entities/category/api/queries";
import { getFeaturedVendors } from "@/entities/vendor/api/queries";
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
  const [categories, featuredProducts, flashSaleProducts, featuredStores] = await Promise.all([
    getCategoriesWithCount(),
    getFeaturedProducts(),
    getFlashSaleProducts(5),
    getFeaturedVendors(6),
  ]);

  return (
    <>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FlashDeals products={flashSaleProducts} />
      <FeaturedProducts products={featuredProducts} />
      <FeaturedStores stores={featuredStores} />
      <PromoSection />
      <BecomeSellerSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
