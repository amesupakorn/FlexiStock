import { Request } from "express";
import prisma from "../database/prisma";

export const createTrack = async (req: Request) => {
  const { orderId, status, location } = req.body;

  return await prisma.tracking.create({
    data: { orderId, status, location },
  });
};

export const getTrackByOrderId = async (req: Request) => {
  const { orderId } = req.params;

  return await prisma.tracking.findMany({
    where: { orderId },
    orderBy: { updatedAt: "desc" },
  });
};
export const updateTrackStatus = async (req: Request) => {
  const { orderId, newStatus, location, delayReason } = req.body;

  const existing = await prisma.tracking.findFirst({ where: { orderId } });
  if (!existing) throw new Error("ไม่พบ orderId นี้");


  await prisma.tracking.create({
    data: {
      orderId,
      status: newStatus,
      location,
      updatedAt: new Date(),
      delayReason
    }
  });
  
  

  return { message: "เปลี่ยนสถานะเรียบร้อย", newStatus };
};


