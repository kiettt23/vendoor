"use client";
import BestSelling from "@/components/features/Product/BestSelling";
import Hero from "@/components/ui/Hero";
import Newsletter from "@/components/layout/Newsletter";
import OurSpec from "@/components/features/Rating/OurSpec";
import LatestProducts from "@/components/features/Product/LatestProducts";

export default function Home() {
  return (
    <div>
      <Hero />
      <LatestProducts />
      <BestSelling />
      <OurSpec />
      <Newsletter />
    </div>
  );
}
