/*
  Warnings:

  - Made the column `storeId` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Store` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "storeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "category" SET NOT NULL;
