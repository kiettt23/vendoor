import { requireRole } from "@/shared/lib/auth";
import { getCategories } from "@/entities/product";
import { CreateProductPage } from "@/widgets/vendor";

export default async function Page() {
  const { session } = await requireRole("VENDOR");

  const categories = await getCategories();

  return (
    <CreateProductPage categories={categories} vendorId={session.user.id} />
  );
}
