import { requireAdmin } from "@/entities/user";
import { AdminOrdersPage } from "@/widgets/admin";

// Force dynamic to ensure fresh order data
export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminOrdersPage />
    </div>
  );
}
