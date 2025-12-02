import { notFound } from "next/navigation";
import { requireRole } from "@/entities/user";
import { getVendorProductForEdit } from "@/entities/product";
import { getCategories } from "@/entities/category";
import { EditProductPage } from "@/widgets/vendor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { session } = await requireRole("VENDOR");

  const { id } = await params;

  const [product, categories] = await Promise.all([
    getVendorProductForEdit(id, session.user.id),
    getCategories(),
  ]);

  if (!product) notFound();

  return <EditProductPage product={product} categories={categories} />;
}
