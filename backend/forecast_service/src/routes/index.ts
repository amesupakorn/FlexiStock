// src/routes/forecastRoutes.ts

import { Router } from "express";
import { saveForecastData } from "../controllers/forecastData";

const router = Router();

// POST route to handle saving forecast data
router.post("/save", async (req, res) => {
  try {
    const forecastData = req.body; 
    const result = await saveForecastData(forecastData);  

    res.status(200).json({
      message: "Forecast data saved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error in route /forecast:", error);
    res.status(500).json({ message: "Error saving forecast data", error: error.message });
  }
});
export default router;