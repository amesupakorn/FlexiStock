import { Router, Request, Response } from "express";
import { createInventory, updateInventory } from "../controllers/inventoryController";

const router = Router();

router.post("/create/inventory", async (req: Request, res: Response) => {
  try {
    await createInventory(req, res);
  } catch (error) {
    console.error("Inventory creation error:", error);
    res.status(500).json({ error: "Failed to create Inventory" });
  }
});

router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    await updateInventory(req, res);
  } catch (error) {
    console.error("Inventory update error:", error);
    res.status(500).json({ error: "Failed to update Inventory" });
  }
});



export default router;