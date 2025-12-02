import { requireAuth } from "@/shared/lib/auth/guards";

import {
  VendorRegistrationForm,
  VendorRegistrationStatus,
  getVendorRegistrationStatus,
} from "@/features/vendor-registration";

export const metadata = {
  title: "Đăng ký bán hàng",
  description: "Đăng ký trở thành người bán trên Vendoor",
};

export default async function VendorRegisterPage() {
  const { user } = await requireAuth();
  const vendorStatus = await getVendorRegistrationStatus(user.id);

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl min-h-[60vh]">
      {vendorStatus ? (
        <VendorRegistrationStatus
          status={vendorStatus.status}
          shopName={vendorStatus.shopName}
          slug={vendorStatus.slug}
        />
      ) : (
        <VendorRegistrationForm userId={user.id} />
      )}
    </div>
  );
}
