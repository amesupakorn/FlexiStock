/*
  Warnings:

  - You are about to drop the column `ds` on the `ForecastHistory` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `ForecastHistory` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_id` on the `ForecastHistory` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `ForecastHistory` table. All the data in the column will be lost.
  - Added the required column `forecastDate` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forecastLower` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forecastUpper` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forecastYhat` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `ForecastHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ForecastHistory" DROP COLUMN "ds",
DROP COLUMN "product_id",
DROP COLUMN "warehouse_id",
DROP COLUMN "y",
ADD COLUMN     "forecastDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "forecastLower" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "forecastUpper" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "forecastYhat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "warehouseId" TEXT NOT NULL;
