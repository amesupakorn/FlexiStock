import axios from "axios";

const API_GATEWAY_URL = "http://localhost:5001"; 

export const fetchSearchProducts = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/search/getproducts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchSearchWarehouses = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/search/getwarehouses`);
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