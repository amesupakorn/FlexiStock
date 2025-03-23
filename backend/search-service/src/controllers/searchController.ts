import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, warehouseId, searchType } = req.query;

    console.log("Received params:", { productId, warehouseId, searchType });

    if (!searchType) {
      res.status(400).json({ message: "Search type is required" });
      return;
    }

    
    if (searchType === "product") {
      if (!productId) {
        res.status(400).json({ message: "Product ID is required for product search" });
        return
      }

      
      const product = await prisma.product.findUnique({
        where: { id: productId as string },
      });

      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      console.log("Product found:", product);
      res.json([product]); // ส่งข้อมูลเป็น Array เพื่อให้ frontend ใช้ได้
      return;
    }

    if (searchType === "inventory") {
      let inventory;

      if (productId && warehouseId) {
        inventory = await prisma.inventory.findMany({
          where: {
            productId: productId as string,
            warehouseId: warehouseId as string,
          },
          include: { product: true, warehouse: true },
        });
      } else if (productId) {
        inventory = await prisma.inventory.findMany({
          where: {
            productId: productId as string,
          },
          include: { product: true, warehouse: true },
        });
      } else {
        inventory = await prisma.inventory.findMany({
          include: { product: true, warehouse: true },
        });
      }
    
      if (inventory.length === 0) {
        res.status(404).json({ message: "No inventory records found" });
        return;
      }
    
      console.log("Inventory found:", inventory);
      res.json(inventory);
      return;
    }

    res.status(400).json({ message: "Invalid search type" });
  } catch (error) {
    console.error("Error in searchStock:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};