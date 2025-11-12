import type { Metadata } from "next";
import { requireAdmin } from "@/features/auth/index.server";

export const metadata: Metadata = {
  title: "Quản trị - Vendoor",
  description: "Quản trị hệ thống Vendoor",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return <>{children}</>;
}
