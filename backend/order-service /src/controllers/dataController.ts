import { Request, RequestHandler, Response } from "express";
import prisma from "../database/prisma";

const DataController = {
  getProducts: (async (req, res) => {
    try {
      const products = await prisma.product.findMany();

      // แปลง Decimal เป็น string ป้องกัน JSON serialization error
      const formattedProducts = products.map((product: { price: { toString: () => any; }; }) => ({
        ...product,
        price: product.price.toString(),
      }));

      res.status(200).json(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }) as RequestHandler,

  getWarehouses: (async (req, res) => {
    try {
      const warehouses = await prisma.warehouse.findMany();
      res.status(200).json(warehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      res.status(500).json({ error: "Failed to fetch warehouses" });
    }
  }) as RequestHandler,
};

export default DataController;