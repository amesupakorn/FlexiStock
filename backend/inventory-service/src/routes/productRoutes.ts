import { Router, Request, Response } from "express";
import { createProduct } from "../controllers/productController";

const router = Router();

router.post("/create/product", async (req: Request, res: Response) => {
  try {
    await createProduct(req, res);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

export default router;