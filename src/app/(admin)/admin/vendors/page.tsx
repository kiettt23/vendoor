import { VendorsPage } from "@/features/admin/components/VendorsPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <VendorsPage searchParams={resolvedSearchParams} />;
}
