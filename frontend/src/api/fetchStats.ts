import axios from "axios";

const API_GATEWAY_URL = "http://localhost:5001";

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
