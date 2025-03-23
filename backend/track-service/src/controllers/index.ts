import { Request, Response } from "express";
import prisma from "../database/prisma";  

// POST /track
export const createTrack = async (req: Request, res: Response) => {
  const { orderId, status, location } = req.body;

  try {
    const track = await prisma.track.create({
      data: { orderId, status, location },
    });
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถสร้างรายการติดตามได้" });
  }
};

// GET /track/:orderId
export const getTrackByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const tracks = await prisma.track.findMany({
      where: { orderId },
      orderBy: { timestamp: "desc" },
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลได้" });
  }
};
