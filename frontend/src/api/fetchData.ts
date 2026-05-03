import axios from "axios";
import API_BASE_URL from "./base";

const API_GATEWAY_URL = API_BASE_URL;  // URL ของ API Gateway

// ฟังก์ชันทดสอบเรียก API
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/orders`);
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const fetchInventory = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/inventory`);
    return response;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};


export const fetchInventoryDetail = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/inventory/detail`);
    return response;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/product`);
      return response;
    } catch (error) {
      console.error("Error fetching Data:", error);
      throw error;
    }
  };

export const fetchWarehouse = async () => {
    try {
      const response = await axios.get(`${API_GATEWAY_URL}/api/inventory/warehouse`);
      return response;
    } catch (error) {
      console.error("Error fetching Data:", error);
      throw error;
    }
  };


export const testAPI = async () => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error testing API:", error);
    throw error;
  }
};