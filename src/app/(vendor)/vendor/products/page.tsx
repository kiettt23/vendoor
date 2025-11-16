import { VendorProductsPage } from "@/features/product/components/VendorProductsPage";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    status?: "all" | "active" | "inactive";
    page?: string;
  }>;
}) {
  return <VendorProductsPage searchParams={props.searchParams} />;
}
