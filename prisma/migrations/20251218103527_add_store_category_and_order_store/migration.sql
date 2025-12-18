-- CreateEnum
CREATE TYPE "StoreCategory" AS ENUM ('fast_food', 'restaurant', 'pharmacy', 'supermarket', 'baby_store');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "storeId" INTEGER;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "category" "StoreCategory";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
