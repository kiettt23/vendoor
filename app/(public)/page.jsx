"use client";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpec from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

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
