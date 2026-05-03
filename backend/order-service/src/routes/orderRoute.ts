import { Router } from "express";
import { createOrder } from "../controllers/createOrder"; 
import { getAllOrders } from "../controllers/getOrders";
import { getStats } from "../controllers/getStats";

const router = Router();

router.post("/createOrder", createOrder); 
router.get("/all", getAllOrders);
router.get("/stats", getStats);

export default router;