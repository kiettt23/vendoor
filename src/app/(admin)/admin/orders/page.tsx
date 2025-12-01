import { requireAdmin } from "@/shared/lib/auth";
import { AdminOrdersPage } from "@/widgets/admin";

export default async function Page() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminOrdersPage />
    </div>
  );
}
