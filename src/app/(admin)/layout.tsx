import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

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

  const handleLogout = async () => {
    "use server";
    await auth.api.signOut({ headers: await headers() });
    redirect("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <Package className="h-6 w-6" />
              <span>Admin Panel</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/vendors"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="h-4 w-4" />
              Vendors
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingCart className="h-4 w-4" />
              Đơn hàng
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Package className="h-4 w-4" />
              Danh mục
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {session.user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">Admin</p>
              </div>
            </div>
            <form action={handleLogout}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
