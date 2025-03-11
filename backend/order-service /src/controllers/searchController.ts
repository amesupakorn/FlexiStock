import { Request, Response } from "express";
import prisma from "../database/prisma";


export const searchStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, warehouseId } = req.query;

    console.log("Received params:", { productId, warehouseId });

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
    
  } catch (error) {
    console.error("Error in searchStock:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
};