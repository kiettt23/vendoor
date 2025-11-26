import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { EditProductPage } from "@/widgets/vendor";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function updateProduct(
  productId: string,
  data: {
    name: string;
    description: string;
    categoryId: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    stock: number;
    isActive: boolean;
  }
) {
  "use server";
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        variants: {
          updateMany: {
            where: { isDefault: true },
            data: {
              price: data.price,
              compareAtPrice: data.compareAtPrice || null,
              sku: data.sku,
              stock: data.stock,
            },
          },
        },
      },
    });
    revalidatePath("/vendor/products");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể cập nhật sản phẩm" };
  }
}

async function deleteProduct(productId: string) {
  "use server";
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/vendor/products");
    return { success: true };
  } catch {
    return { success: false, error: "Không thể xóa sản phẩm" };
  }
}

export default async function Page({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) redirect("/");

  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id, vendorId: session.user.id },
    include: {
      images: { select: { id: true, url: true }, orderBy: { order: "asc" } },
      variants: { select: { id: true, name: true, price: true, compareAtPrice: true, sku: true, stock: true, isDefault: true } },
    },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <EditProductPage
      product={product}
      categories={categories}
      onUpdate={(data) => updateProduct(product.id, data)}
      onDelete={() => deleteProduct(product.id)}
    />
  );
}
