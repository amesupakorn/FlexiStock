import axios from "axios";
import API_BASE_URL from "./base";

const API_GATEWAY_URL = API_BASE_URL;

export const fetchDashboardStats = async () => {
  try {
    const [orderStats, inventoryStats, warehouses, products] = await Promise.all([
      axios.get(`${API_GATEWAY_URL}/api/orders/stats`),
      axios.get(`${API_GATEWAY_URL}/api/inventory/stats`),
      axios.get(`${API_GATEWAY_URL}/api/inventory/warehouse`),
      axios.get(`${API_GATEWAY_URL}/api/inventory/product`)
    ]);

    return {
      orders: orderStats.data,
      inventory: inventoryStats.data,
      warehouses: warehouses.data,
      products: products.data
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
