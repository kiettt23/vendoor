import { requireRole } from "@/entities/user";
import { getCategories } from "@/entities/category";
import { CreateProductPage } from "@/widgets/vendor";

export default async function Page() {
  const { session } = await requireRole("VENDOR");

  const categories = await getCategories();

  return (
    <CreateProductPage categories={categories} vendorId={session.user.id} />
  );
}
