import { cache } from "react";
import { prisma, vendorProductListInclude, vendorProductEditInclude } from "@/shared/lib/db";

// ============================================================================
// Vendor Product Queries
// ============================================================================

/**
 * Lấy danh sách sản phẩm của vendor (cho vendor dashboard)
 */
export const getVendorProducts = cache(async (vendorId: string) => {
  return prisma.product.findMany({
    where: { vendorId },
    include: vendorProductListInclude,
    orderBy: { createdAt: "desc" },
  });
});

export type VendorProduct = Awaited<
  ReturnType<typeof getVendorProducts>
>[number];

/**
 * Lấy chi tiết sản phẩm của vendor để edit
 */
export const getVendorProductForEdit = cache(
  async (productId: string, vendorId: string) => {
    return prisma.product.findFirst({
      where: { id: productId, vendorId },
      include: vendorProductEditInclude,
    });
  }
);

export type VendorProductForEdit = Awaited<
  ReturnType<typeof getVendorProductForEdit>
>;
