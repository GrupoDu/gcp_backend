/*
  Warnings:

  - Made the column `stock_quantity` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `stock_updates` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "produced_quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "production_order" ALTER COLUMN "delivered_at" DROP NOT NULL,
ALTER COLUMN "order_uuid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "stock_quantity" SET NOT NULL;

-- AlterTable
ALTER TABLE "stock_updates" ALTER COLUMN "date" SET NOT NULL;
