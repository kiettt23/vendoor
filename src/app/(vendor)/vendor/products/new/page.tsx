import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { CreateProductPage } from "@/widgets/vendor";

async function createProduct(data: {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  isActive: boolean;
}) {
  "use server";
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .concat("-", Date.now().toString(36));

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        categoryId: data.categoryId,
        vendorId: session.user.id,
        isActive: data.isActive,
        variants: {
          create: {
            name: null,
            price: data.price,
            compareAtPrice: data.compareAtPrice || null,
            sku: data.sku,
            stock: data.stock,
            isDefault: true,
          },
        },
      },
    });
    revalidatePath("/vendor/products");
    return { success: true, productId: product.id };
  } catch {
    return { success: false, error: "Không thể tạo sản phẩm" };
  }
}

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) redirect("/");

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return <CreateProductPage categories={categories} onCreate={createProduct} />;
}
