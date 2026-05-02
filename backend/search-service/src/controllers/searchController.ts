import axios from "axios";

const INVENTORY_BASE_URL = process.env.INVENTORY_SERVICE_URL || "http://inventory-service:8080";

export const fetchInventory = async (params: { productId?: string; warehouseId?: string; searchType?: string }) => {
  const response = await axios.get(`${INVENTORY_BASE_URL}/search`, { params });
  return response.data;
};