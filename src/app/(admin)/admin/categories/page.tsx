import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { AdminCategoriesPage } from "@/widgets/admin";

async function createCategory(name: string) {
  "use server";
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    await prisma.category.create({ data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể tạo danh mục" };
  }
}

async function updateCategory(id: string, name: string) {
  "use server";
  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  try {
    await prisma.category.update({ where: { id }, data: { name, slug } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể cập nhật" };
  }
}

async function deleteCategory(id: string) {
  "use server";
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể xóa" };
  }
}

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("ADMIN")) redirect("/");

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

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
