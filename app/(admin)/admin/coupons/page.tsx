import { requireAdmin } from "@/features/auth/index.server";
import prisma from "@/shared/configs/prisma";
import CouponsClient from "./_components/CouponsClient";

// ✅ Server Component - Fetch coupons
export default async function AdminCoupons() {
  // ✅ Check auth on server
  await requireAdmin();

  // ✅ Fetch coupons directly from database
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize dates for client
  const serializedCoupons = coupons.map(
    (coupon: {
      code: string;
      description: string;
      discount: number;
      expiresAt: Date;
      createdAt: Date;
      isPublic: boolean;
      forNewUser: boolean;
      forMember: boolean;
    }) => ({
      ...coupon,
      expiresAt: coupon.expiresAt.toISOString(),
      createdAt: coupon.createdAt.toISOString(),
    })
  );

  return <CouponsClient coupons={serializedCoupons} />;
}
