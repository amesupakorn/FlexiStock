import axios from "axios";
import API_BASE_URL from "./base";

const API_GATEWAY_URL = API_BASE_URL; 

export const fetchForecast = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/orders/forecast`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
