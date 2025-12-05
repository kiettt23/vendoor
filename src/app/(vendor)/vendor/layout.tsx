import { redirect } from "next/navigation";
import { getCurrentVendorProfile } from "@/entities/vendor";
import { VendorSidebar } from "@/widgets/vendor/ui/VendorSidebar";

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
      <div className="w-full px-2 md:px-6 lg:px-12">
        <div className="flex gap-6 py-6">
          {/* Sidebar */}
          <VendorSidebar />

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
