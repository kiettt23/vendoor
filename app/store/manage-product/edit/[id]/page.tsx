import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { requireSellerWithStore } from "@/lib/auth";
import EditProductForm from "./_components/EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params (Next.js 15+)
  const { id } = await params;

  // Check if user is seller and get storeId
  let storeId: string;
  try {
    const { storeId: id } = await requireSellerWithStore();
    storeId = id;
  } catch (error) {
    redirect("/create-store");
  }

  // Get product
  const product = await prisma.product.findUnique({
    where: { id },
  });

  // Check if product exists and belongs to this store
  if (!product || product.storeId !== storeId) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-700 mb-6">
        Chỉnh sửa sản phẩm
      </h1>
      <EditProductForm product={product} />
    </div>
  );
}
