import axios from "axios";

const API_GATEWAY_URL = "http://localhost:5001"; 

export const fetchForecast = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/forecast`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
