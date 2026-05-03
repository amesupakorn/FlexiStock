import axios from "axios";
import { API_URLS } from "./base";

const API_Near_URL = `${API_URLS.ORDERS}/nearest`;
const API_create_URL = `${API_URLS.ORDERS}/createOrder`;



export const getNearestWarehouse = async (lat: number, lng: number) => {
  try {
    const response = await axios.post(API_Near_URL, { lat, lng });
    return response.data; 
  } catch (error) {
    console.error("Error fetching nearest warehouse:", error);
    throw error;
  }
};

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
    const response = await axios.get(`${API_URLS.ORDERS}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};