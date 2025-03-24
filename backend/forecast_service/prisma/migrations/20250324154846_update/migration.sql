/*
  Warnings:

  - You are about to drop the `InventoryForecast` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "InventoryForecast";

-- CreateTable
CREATE TABLE "ForecastHistory" (
    "id" TEXT NOT NULL,
    "ds" TEXT NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "product_id" TEXT NOT NULL,
    "warehouse_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForecastHistory_pkey" PRIMARY KEY ("id")
);
