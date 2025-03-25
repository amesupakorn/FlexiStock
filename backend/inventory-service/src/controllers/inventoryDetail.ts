import { Request, Response } from 'express';
import prisma from '../database/prisma';  

export const getInventoryDetails = async (req: Request, res: Response) => {
  try {
    // Fetch inventory with related product and warehouse data
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,   
        warehouse: true,
      },
    });

    res.json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving inventory details' });
  }
};
