import { Router } from "express";
import { callForecast } from "../controllers/callForecast";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const forecast = await callForecast();
    res.json(forecast);
  } catch (error) {
    console.error("Forecast API error:", error);
    res.status(500).json({ error: "Failed to fetch forecast data" });
  }
});

export default router;