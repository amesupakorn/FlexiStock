import axios from "axios";

const API_Near_URL = "http://localhost:5001/api/orders/nearest";
const API_create_URL = "http://localhost:5001/api/orders/createOrder";

const API_GATEWAY_URL = "http://localhost:5001/api/orders/createOrder"; 

export const getNearestWarehouse = async (lat: number, lng: number) => {
  try {
    const response = await axios.post(API_Near_URL, { lat, lng });
    return response.data; 
  } catch (error) {
    console.error("Error fetching nearest warehouse:", error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const createOrder = async (customerData: any, selectedItems: any[], warehouse_id: string) => {
  try {
    const response = await axios.post(`${API_create_URL}`, {
      customerData,
      selectedItems,
      warehouse_id
    });
    return response.data; 
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const response = await axios.get("http://localhost:5001/api/orders/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};