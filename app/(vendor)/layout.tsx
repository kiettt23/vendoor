import type { Metadata } from "next";
import { requireSellerWithStore } from "@/features/auth/index.server";

export const metadata: Metadata = {
  title: "Quản lý cửa hàng - Vendoor",
  description: "Quản lý cửa hàng và sản phẩm của bạn",
};

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSellerWithStore();

  return <>{children}</>;
}
