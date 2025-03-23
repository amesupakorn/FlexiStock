import { Router } from "express";
import DataController from "../controllers/index";

const router = Router();

router.get("/", DataController.getWarehouses);

export default router;