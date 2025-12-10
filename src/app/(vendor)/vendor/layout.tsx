import { redirect } from "next/navigation";
import { getCurrentVendorProfile } from "@/entities/vendor/api/queries";
import { DashboardShell } from "@/widgets/dashboard-shell";
import { ROUTES } from "@/shared/lib/constants";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const vendorProfile = await getCurrentVendorProfile();

  if (!vendorProfile) {
    redirect(ROUTES.LOGIN);
  }

  return <DashboardShell type="vendor">{children}</DashboardShell>;
}
