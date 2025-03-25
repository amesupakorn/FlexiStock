import { Request, Response } from "express";
import prisma from "../database/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // ดึง id ล่าสุดจากฐานข้อมูล (เรียงตาม id แบบตัวเลข)
    const lastProduct = await prisma.product.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    let newId: string;

    if (!lastProduct) {
      newId = "P01"; 
    } else {
      const lastNumber = parseInt(lastProduct.id.replace("P", ""));
      const nextNumber = lastNumber + 1;

      newId = `P${nextNumber.toString().padStart(2, "0")}`;
    }

    // สร้าง product ใหม่
    const product = await prisma.product.create({
      data: {
        id: newId,
        name,
        description,
        price: parseFloat(price),
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Failed to create product" });
  }
};