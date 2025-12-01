import { requireVendor } from "@/shared/lib/auth";
import { VendorDashboardPage } from "@/widgets/vendor";

export default async function VendorDashboardRoute() {
  const { session } = await requireVendor();

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorDashboardPage userId={session.user.id} />
    </div>
  );
}
