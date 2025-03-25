// controllers/warehouse.ts
import axios from "axios";
import { haversineDistance } from "../utils/haversine";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const geocodeLocation = async (place: string) => {
  try {
    const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: place,
        key: GOOGLE_API_KEY,
      },
    });

    const location = geoRes.data.results[0]?.geometry.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (err) {
    console.error("Geocode error:", err);
    return null;
  }
};

export const findNearestWarehouse = async (
  lat: number,
  lng: number
): Promise<{ warehouse: any; distance_km: number } | null> => {
  try {
    const response = await axios.get("http://localhost:5001/api/inventory/warehouse");
    const warehouses = response.data;

    const enrichedWarehouses = await Promise.all(
      warehouses.map(async (w: any) => {
        if (w.latitude && w.longitude) {
          return { ...w, lat: w.latitude, lng: w.longitude };
        }
        const geo = await geocodeLocation(w.location || w.name);
        if (!geo) return null;
        return { ...w, lat: geo.lat, lng: geo.lng };
      })
    );

    const validWarehouses = enrichedWarehouses.filter(Boolean);

    if (validWarehouses.length === 0) return null;

    const distances = validWarehouses.map((warehouse: any) => {
      const distance = haversineDistance(lat, lng, warehouse.lat, warehouse.lng);
      return { warehouse, distance };
    });

    const nearest = distances.reduce((min, curr) =>
      curr.distance < min.distance ? curr : min
    );

    return {
      warehouse: nearest.warehouse,
      distance_km: Number(nearest.distance.toFixed(2)),
    };
  } catch (error) {
    console.error("Error finding nearest warehouse:", error);
    return null;
  }
};