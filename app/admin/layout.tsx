import AdminLayout from "./_components/AdminLayout";
import { requireAdmin } from "@/features/auth/server";

export const metadata = {
  title: "Vendoor | Admin",
  description: "Admin Dashboard",
};

export default async function RootAdminLayout({ children }) {
  // Require admin role - auto redirects if not admin
  await requireAdmin();

  return <AdminLayout>{children}</AdminLayout>;
}
