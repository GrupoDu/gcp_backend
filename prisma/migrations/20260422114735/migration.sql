/*
  Warnings:

  - Added the required column `product_uuid` to the `production_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "production_order" ADD COLUMN     "product_uuid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "production_order" ADD CONSTRAINT "production_order_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("product_uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
