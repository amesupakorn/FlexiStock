import axios from "axios";

const INVENTORY_BASE_URL = "http://localhost:5001/api/inventory";

export const fetchInventory = async (params: { productId?: string; warehouseId?: string; searchType?: string }) => {
  const response = await axios.get(`${INVENTORY_BASE_URL}/search`, { params });
  return response.data;
};