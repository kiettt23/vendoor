import { EditProductPage } from "@/features/product/components/EditProductPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  return <EditProductPage productId={params.id} />;
}
