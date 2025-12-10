import { requireAdmin } from "@/entities/user";
import { AdminCategoriesPage } from "@/widgets/admin";
import { getCategoriesAdmin } from "@/entities/category/api/queries";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/entities/category";

export default async function Page() {
  await requireAdmin();

  const categories = await getCategoriesAdmin();

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminCategoriesPage
        categories={categories}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}
