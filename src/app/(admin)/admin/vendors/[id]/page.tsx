import { VendorDetailPage } from "@/features/admin/components/VendorDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VendorDetailPage vendorId={id} />;
}
