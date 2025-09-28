import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Vendoor | Admin",
  description: "Admin",
};

export default function RootAdminLayout({ children }) {
  return (
    <>
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
