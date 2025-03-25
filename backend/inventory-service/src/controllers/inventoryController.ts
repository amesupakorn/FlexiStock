import { Request, Response } from "express";
import prisma from "../database/prisma";

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
        return;
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

export const createInventory = async (req: Request, res: Response) => {
  try {
    const { productId, warehouseId, stock, minStock, maxStock } = req.body;

    if (!productId || !warehouseId || stock === undefined || minStock === undefined || maxStock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // สร้าง Inventory ใหม่ในฐานข้อมูล
    const inventory = await prisma.inventory.create({
      data: {
        productId,
        warehouseId,
        stock,
        minStock,
        maxStock,
      },
    });

    return res.status(201).json(inventory); // ส่งข้อมูลที่สร้างแล้วกลับไปยัง client
  } catch (error) {
    console.error("Error creating inventory:", error);
    return res.status(500).json({ error: "Failed to create inventory" });
  }
};


export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stockChange, minStock, maxStock } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Inventory ID is required" });
    }

    // ตรวจสอบว่า inventory มีอยู่จริง
    const existingInventory = await prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingInventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // คำนวณ stock ใหม่ ถ้ามีการเปลี่ยนแปลง
    let updatedStock = existingInventory.stock;
    if (typeof stockChange === "number") {
      updatedStock += stockChange;
      if (updatedStock < 0) updatedStock = 0; // ป้องกันติดลบ
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        stock: updatedStock,
        minStock: typeof minStock === "number" ? minStock : existingInventory.minStock,
        maxStock: typeof maxStock === "number" ? maxStock : existingInventory.maxStock,
      },
    });

    return res.status(200).json(updatedInventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({ error: "Failed to update inventory" });
  }
};
