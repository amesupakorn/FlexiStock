const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const API_URLS = {
  ORDERS: `${API_BASE_URL}/api/orders`,
  INVENTORY: `${API_BASE_URL}/api/inventory`,
  TRACK: `${API_BASE_URL}/api/track`,
  SEARCH: `${API_BASE_URL}/api/search`,
  FORECAST: `${API_BASE_URL}/api/forecast`,
};

export default API_BASE_URL;
