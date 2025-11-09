import AdminLayout from "./_components/AdminLayout";
import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/auth/";

export const metadata = {
  title: "Vendoor | Admin",
  description: "Admin",
};

export default async function RootAdminLayout({ children }) {
  // Check if user is admin
  const { isAdmin } = await checkIsAdmin();

  if (!isAdmin) {
    // Redirect to home if not admin
    redirect("/");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
