import { VendorsPage } from "@/features/admin/components/VendorsPage";

export default function Page({
  searchParams,
}: {
  searchParams: { page?: string; status?: string; search?: string };
}) {
  return <VendorsPage searchParams={searchParams} />;
}
