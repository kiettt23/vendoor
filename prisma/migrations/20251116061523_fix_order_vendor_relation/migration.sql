-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_vendorId_fkey";

-- CreateIndex
CREATE INDEX "product_variants_productId_isDefault_idx" ON "product_variants"("productId", "isDefault");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
