import { requireVendor } from "@/entities/vendor";
import { VendorDashboardPage } from "@/widgets/vendor";

// Force dynamic to ensure fresh vendor data
export const dynamic = "force-dynamic";

export default async function VendorDashboardRoute() {
  const { session } = await requireVendor();

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorDashboardPage userId={session.user.id} />
    </div>
  );
}
