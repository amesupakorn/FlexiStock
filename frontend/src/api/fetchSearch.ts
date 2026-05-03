import axios from "axios";
import API_BASE_URL from "./base";

const API_GATEWAY_URL = API_BASE_URL; 


export const fetchSearchProducts = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/product`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchSearchWarehouses = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/warehouse`);
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw error;
  }
};

export const fetchSearchResults = async (params?: { productId?: string; warehouseId?: string; searchType?: string }) => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/search`, { params });
    return response;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};