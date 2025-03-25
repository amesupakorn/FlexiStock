import { Router } from "express";
import { findNearestWarehouse } from "../controllers/warehouseController";

const router = Router();

router.post("/nearest", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Missing lat/lng" });
    }

    const result = await findNearestWarehouse(lat, lng);

    if (!result) {
      return res.status(404).json({ error: "No valid warehouse found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Nearest warehouse error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;