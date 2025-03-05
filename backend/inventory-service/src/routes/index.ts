import { Router } from "express";
import { getInventory } from "../controllers/index";

const router = Router();

router.get("/", getInventory);

export default router;