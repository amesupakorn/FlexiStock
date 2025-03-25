import { Router, Request, Response } from "express";
import { findNearestWarehouse } from "../controllers/warehouse";

const router = Router();

router.post("/nearest", async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const result = await findNearestWarehouse(lat, lng);
    res.json(result);
  } catch (error) {
    console.error("Nearest warehouse error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;