import { Request, Response } from "express";
import prisma from "../database/prisma";

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalOrders = await prisma.order.count();
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const revenue = await prisma.order.aggregate({
      _sum: {
        totalPrice: true
      }
    });

    // Active tracking (not delivered)
    const activeTracking = await prisma.tracking.count({
      where: {
        status: {
          not: 'Delivered'
        }
      }
    });

    res.json({
      totalOrders,
      ordersByStatus,
      totalRevenue: revenue._sum.totalPrice || 0,
      activeShipments: activeTracking
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
