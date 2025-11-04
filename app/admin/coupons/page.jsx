import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CouponsClient from "./_components/CouponsClient";

// ✅ Server Component - Fetch coupons
export default async function AdminCoupons() {
  // ✅ Check auth on server
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // ✅ Fetch coupons directly from database
  const coupons = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize dates for client
  const serializedCoupons = coupons.map((coupon) => ({
    ...coupon,
    expiresAt: coupon.expiresAt.toISOString(),
    createdAt: coupon.createdAt.toISOString(),
  }));

  return <CouponsClient coupons={serializedCoupons} />;
}
