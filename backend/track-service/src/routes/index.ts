import express from "express";
import { createTrack, getTrackByOrderId } from "../controllers";

const router = express.Router();

router.post("/track", createTrack);
router.get("/track/:orderId", getTrackByOrderId);

export default router;
