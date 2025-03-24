import { Router } from "express";
import { sendForecastData } from "../controllers/forecast";

const router = Router();

router.get("/forecast", async (req, res) => {
  try {
    const result = await sendForecastData();
    res.json(result);
  } catch (error) {
    console.error("Forecast error:", error);
    res.status(500).json({ error: "Forecast failed" });
  }
});

export default router;