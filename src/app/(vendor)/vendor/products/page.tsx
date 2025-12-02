import { requireRole } from "@/entities/user";
import { VendorProductsPage } from "@/widgets/vendor";

export default async function Page() {
  await requireRole("VENDOR");

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorProductsPage />
    </div>
  );
}
