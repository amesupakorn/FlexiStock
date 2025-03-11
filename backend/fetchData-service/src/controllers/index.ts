import { Request, RequestHandler, Response } from "express";
import prisma from "../database/prisma";


const DataController = {

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