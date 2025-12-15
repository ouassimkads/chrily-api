-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "storeId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
