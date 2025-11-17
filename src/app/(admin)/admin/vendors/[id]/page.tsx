import { VendorDetailPage } from "@/features/admin/components/VendorDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <VendorDetailPage vendorId={params.id} />;
}
