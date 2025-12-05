import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/widgets/admin/ui/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  // Check if user is admin
  if (!session || !session.user.roles?.includes("ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-2 md:px-6 lg:px-12">
        <div className="flex gap-6 py-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="sticky top-24">
              <AdminSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
