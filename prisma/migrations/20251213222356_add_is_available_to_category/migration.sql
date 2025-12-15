-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "storeId" DROP DEFAULT;
