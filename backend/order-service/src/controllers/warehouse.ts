// controllers/warehouse.ts
import axios from "axios";
import { haversineDistance } from "../utils/haversine";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_API_KEY = process.env.Google_MAP_API;

const geocodeLocation = async (place: string): Promise<{ lat: number; lng: number } | null> => {
  if (!GOOGLE_API_KEY) {
    console.warn("⚠️  Google_MAP_API key is not set — cannot geocode warehouse locations.");
    return null;
  }
  try {
    const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: { address: place, key: GOOGLE_API_KEY },
      timeout: 5000,
    });

    if (geoRes.data.status !== "OK") {
      console.warn(`Geocode returned status: ${geoRes.data.status} for "${place}"`);
      return null;
    }

    const location = geoRes.data.results[0]?.geometry?.location;
    return location ? { lat: location.lat, lng: location.lng } : null;
  } catch (err) {
    console.error(`Geocode error for "${place}":`, err);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractCoords = async (w: any): Promise<{ lat: number; lng: number } | null> => {
  // 1. Direct lat/lng fields
  if (typeof w.lat === "number" && typeof w.lng === "number") {
    return { lat: w.lat, lng: w.lng };
  }
  // 2. latitude/longitude fields (alternative naming)
  if (typeof w.latitude === "number" && typeof w.longitude === "number") {
    return { lat: w.latitude, lng: w.longitude };
  }
  // 3. Parseable strings
  const parsedLat = parseFloat(w.lat ?? w.latitude);
  const parsedLng = parseFloat(w.lng ?? w.longitude);
  if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
    return { lat: parsedLat, lng: parsedLng };
  }
  // 4. Fallback: geocode the location name/address
  const address = w.location || w.name;
  if (address) {
    console.log(`📍 Geocoding warehouse "${w.name}" using address: "${address}"`);
    return geocodeLocation(address);
  }
  return null;
};

export const findNearestWarehouse = async (
  lat: number,
  lng: number
): Promise<{ warehouse: unknown; distance_km: number; estimated_time_mins: number } | null> => {
  try {
    const INVENTORY_SERVICE_URL =
      process.env.INVENTORY_SERVICE_URL || "http://inventory-service:8080";

    console.log(`🔍 Fetching warehouses from ${INVENTORY_SERVICE_URL}/warehouse`);
    const response = await axios.get(`${INVENTORY_SERVICE_URL}/warehouse`, { timeout: 8000 });
    const warehouses = response.data;

    if (!warehouses || warehouses.length === 0) {
      console.warn("⚠️  No warehouses returned from inventory service.");
      return null;
    }

    console.log(`✅ Got ${warehouses.length} warehouse(s). Resolving coordinates...`);

    const enrichedWarehouses = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      warehouses.map(async (w: any) => {
        const coords = await extractCoords(w);
        if (!coords) {
          console.warn(`⚠️  Could not resolve coordinates for warehouse "${w.name}" (id: ${w.id})`);
          return null;
        }
        return { ...w, lat: coords.lat, lng: coords.lng };
      })
    );

    const validWarehouses = enrichedWarehouses.filter(Boolean);

    if (validWarehouses.length === 0) {
      console.error("❌ No warehouses with resolvable coordinates.");
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const distances = validWarehouses.map((warehouse: any) => {
      const distance = haversineDistance(lat, lng, warehouse.lat, warehouse.lng);
      return { warehouse, distance };
    });

    const nearest = distances.reduce((min, curr) =>
      curr.distance < min.distance ? curr : min
    );

    const estimatedTimeMins = (nearest.distance / 50) * 60;

    console.log(
      `🏆 Nearest: "${nearest.warehouse.name}" — ${nearest.distance.toFixed(2)} km, ~${Math.ceil(estimatedTimeMins)} min`
    );

    return {
      warehouse: nearest.warehouse,
      distance_km: Number(nearest.distance.toFixed(2)),
      estimated_time_mins: Math.ceil(estimatedTimeMins),
    };
  } catch (error) {
    console.error("❌ Error finding nearest warehouse:", error);
    return null;
  }
};