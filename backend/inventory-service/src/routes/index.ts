import { Router } from "express";
import DataController  from "../controllers/getData";
import { searchStock } from "../controllers/inventoryController";
const router = Router();

router.get("/inventory", DataController.getInventory);
router.get("/warehouse", DataController.getWarehouses);
router.get("/product", DataController.getProducts);
router.get("/search", searchStock);


export default router;