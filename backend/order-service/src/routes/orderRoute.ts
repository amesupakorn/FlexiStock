import { Router } from "express";
import { createOrder } from "../controllers/createOrder"; 

const router = Router();

router.post("/createOrder", createOrder); 

export default router;