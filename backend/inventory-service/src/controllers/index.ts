import { Request, Response } from "express";
import prisma from "../database/prisma";  


// Controller สำหรับดึงข้อมูลสินค้าทั้งหมด
export const getInventory = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany(); 
    res.json(products);  

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};