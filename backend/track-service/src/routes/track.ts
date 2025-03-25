import { Router } from "express";
import { createTrack, getTrackByOrderId, updateTrackStatus } from "../controllers/trackController";

const router = Router();

// POST /track
router.post("/track", async (req, res) => {
  try {
    const result = await createTrack(req); // ✅ ส่งแค่ req
    res.status(201).json(result);
  } catch (error) {
    console.error("Create track error:", error);
    res.status(500).json({ error: "ไม่สามารถสร้างรายการติดตามได้" });
  }
});

// GET /track/:orderId
router.get("/:orderId", async (req, res) => {
  try {
    const result = await getTrackByOrderId(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get track error:", error);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลการติดตามได้" });
  }
});

router.patch("/update", async (req, res) => {
  try {
    console.log("🔧 PATCH /update", req.body); // ✅ log ที่สำคัญ
    const result = await updateTrackStatus(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ UPDATE ERROR", error);
    const message = error instanceof Error ? error.message : "ไม่สามารถอัปเดตสถานะได้";
    res.status(500).json({ error: message });
  }
});





export default router;
