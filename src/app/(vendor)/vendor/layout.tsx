import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentVendorProfile } from "@/entities/vendor";
import { VENDOR_NAV_ITEMS } from "@/shared/lib/constants";

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
  // Check if user is a vendor (has vendorProfile)
  const vendorProfile = await getCurrentVendorProfile();

  if (!vendorProfile) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex gap-6 py-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {VENDOR_NAV_ITEMS.map((item) => {
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
