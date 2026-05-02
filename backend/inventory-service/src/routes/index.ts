import { Router } from "express";
import DataController  from "../controllers/getData";
import { searchStock } from "../controllers/inventoryController";
import { getInventoryDetails } from "../controllers/inventoryDetail";
import inventoryRoute from "./inventoryRoute";
import productRoutes from "./productRoutes";

const router = Router();

router.get("/inventory", DataController.getInventory);
router.get("/warehouse", DataController.getWarehouses);
router.get("/product", DataController.getProducts);
router.get("/search", searchStock);
router.get("/inventory/detail", getInventoryDetails);

// Routes for creating and updating inventory/products
router.use("/", inventoryRoute);
router.use("/", productRoutes);

export default router;