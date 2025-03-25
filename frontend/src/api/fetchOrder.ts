import axios from "axios";

const API_Near_URL = "http://localhost:5002/nearest";
const API_GATEWAY_URL = "http://localhost:5001"; 

export const getNearestWarehouse = async (lat: number, lng: number) => {
  try {
    const response = await axios.post(API_Near_URL, { lat, lng });
    return response.data; 
  } catch (error) {
    console.error("Error fetching nearest warehouse:", error);
    throw error;
  }
};

export const createOrder= async () => {
    try {
      const response = await axios.post(`${API_GATEWAY_URL}/api/orders/create`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching nearest warehouse:", error);
      throw error;
    }
  };
  