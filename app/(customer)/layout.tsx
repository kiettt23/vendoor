import type { Metadata } from "next";
import { Banner, Navbar, Footer } from "@/shared/layouts";

export const metadata: Metadata = {
  title: "Vendoor - Multi Vendor E-commerce",
  description: "Nền tảng thương mại điện tử đa nhà cung cấp",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Banner />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
