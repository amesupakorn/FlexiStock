import prisma from "../database/prisma";

export const saveForecastData = async (forecastData: any) => {
  try {
    // Validate if the data is an array
    if (!Array.isArray(forecastData)) {
      throw new Error("Invalid data format, expected an array.");
    }

    // Save the forecast data into the database
    const forecastEntries = await prisma.forecastHistory.createMany({
      data: forecastData.map((data: any) => ({
        productId: data.product_id,
        warehouseId: data.warehouse_id, 
        forecastDate: new Date(data.forecastDate), 
        forecastYhat: data.yhat, 
        forecastLower: data.yhat_lower, 
        forecastUpper: data.yhat_upper, 
      })),
    });

    return forecastEntries;
  } catch (error) {
    console.error("Error saving forecast data:", error);
    throw error;
  }
};