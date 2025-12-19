import { getCachedFeaturedProducts } from "@/entities/product/api/product-list.queries";
import { getCachedFlashSaleProducts } from "@/entities/product/api/flash-sale.queries";
import { getCategoriesWithCount } from "@/entities/category/api/queries";
import { getCachedFeaturedVendors } from "@/entities/vendor/api/queries";
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
  const [categories, featuredProducts, flashSaleProducts, featuredStores] =
    await Promise.all([
      getCategoriesWithCount(),
      getCachedFeaturedProducts(),
      getCachedFlashSaleProducts(5),
      getCachedFeaturedVendors(6),
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
