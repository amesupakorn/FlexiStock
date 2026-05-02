import { Router } from "express";
import { createOrder } from "../controllers/createOrder"; 
import { getAllOrders } from "../controllers/getOrders";

const router = Router();

router.post("/createOrder", createOrder); 
router.get("/all", getAllOrders);

export default router;