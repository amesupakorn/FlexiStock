-- CreateTable
CREATE TABLE "InventoryForecast" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "predictedDemand" INTEGER NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryForecast_pkey" PRIMARY KEY ("id")
);
