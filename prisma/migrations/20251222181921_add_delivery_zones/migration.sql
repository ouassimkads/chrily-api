-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "zoneId" INTEGER;

-- CreateTable
CREATE TABLE "StoreDeliveryPrice" (
    "storeId" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StoreDeliveryPrice_pkey" PRIMARY KEY ("storeId","zoneId")
);

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoreDeliveryPrice" ADD CONSTRAINT "StoreDeliveryPrice_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreDeliveryPrice" ADD CONSTRAINT "StoreDeliveryPrice_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "DeliveryZone"("id") ON DELETE SET NULL ON UPDATE CASCADE;
