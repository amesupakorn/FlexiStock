import express from "express";
import { fetchInventory } from "../controllers/searchController";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { productId, warehouseId, searchType} = req.query;
    const data = await fetchInventory({ productId: productId as string, warehouseId: warehouseId as string, searchType: searchType as string});
    res.json(data);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

export default router;