import { Request, Response } from "express";
import prisma from "../database/prisma";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalWarehouses = await prisma.warehouse.count();
    
    const inventoryStats = await prisma.inventory.aggregate({
      _sum: {
        stock: true
      }
    });

    const lowStockCount = await prisma.inventory.count({
      where: {
        stock: {
          lt: prisma.inventory.fields.minStock as any // This might need a different approach in Prisma
        }
      }
    });
    
    // Fallback for lowStockCount if the above doesn't work well in Prisma
    const allInventory = await prisma.inventory.findMany();
    const actualLowStock = allInventory.filter(i => i.stock < i.minStock).length;

    res.json({
      totalProducts,
      totalWarehouses,
      totalStock: inventoryStats._sum.stock || 0,
      lowStockItems: actualLowStock
    });
  } catch (error) {
    console.error("Error fetching inventory stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
