import { requireRole } from "@/shared/lib/auth";
import { VendorReviewsPage } from "@/widgets/vendor";

export const metadata = {
  title: "Đánh giá sản phẩm | Vendor Dashboard",
};

export default async function Page() {
  await requireRole("VENDOR");

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorReviewsPage />
    </div>
  );
}
