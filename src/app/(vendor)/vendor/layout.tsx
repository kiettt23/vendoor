import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Store,
} from "lucide-react";
import { prisma } from "@/shared/lib/prisma";

// ============================================
// VENDOR LAYOUT
// ============================================

/**
 * Layout for vendor dashboard
 *
 * **Features:**
 * - Sidebar navigation
 * - Auth check (verifies vendorProfile exists)
 * - Responsive design
 */

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check if user is a vendor (has vendorProfile)
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, shopName: true },
  });

  if (!vendorProfile) {
    redirect("/"); // Not a vendor
  }

  const navItems = [
    {
      href: "/vendor",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/vendor/products",
      label: "Sản phẩm",
      icon: Package,
    },
    {
      href: "/vendor/orders",
      label: "Đơn hàng",
      icon: ShoppingCart,
    },
    {
      href: "/vendor/earnings",
      label: "Doanh thu",
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-bold text-lg">{vendorProfile.shopName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4">
        <div className="flex gap-6 py-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
