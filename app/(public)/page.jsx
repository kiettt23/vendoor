"use client";
import BestSelling from "@/components/features/BestSelling";
import Hero from "@/components/layout/Hero";
import Newsletter from "@/components/features/Newsletter";
import OurSpec from "@/components/features/OurSpec";
import LatestProducts from "@/components/features/LatestProducts";

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
