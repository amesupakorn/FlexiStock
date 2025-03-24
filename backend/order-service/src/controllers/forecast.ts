import prisma  from "../database/prisma";
import axios from "axios";

export const sendForecastData = async () => {
  const orderItems = await prisma.order.findMany({
  });

  const grouped = new Map<string, number>();

  for (const item of orderItems) {
    const ds = item.createdAt.toISOString().split("T")[0];
    const key = `${ds}-${item.productId}-${item.warehouseId}`;
    const current = grouped.get(key) || 0;
    grouped.set(key, current + item.quantity);
  }

  const forecastData = Array.from(grouped.entries()).map(([key, y]) => {
    const [ds, product_id, warehouse_id] = key.split("-");
    return { ds, y, product_id, warehouse_id };
  });

  const response = await axios.post("http://localhost:8000/forecast", forecastData);
  return response.data;
};