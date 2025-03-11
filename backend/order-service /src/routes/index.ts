import { Router } from "express";
import DataController from "../controllers/dataController";
import { searchStock } from "../controllers/searchController";

const router = Router();

router.get("/getproducts", DataController.getProducts);
router.get("/getwarehouses", DataController.getWarehouses);

router.get("/", searchStock);

export default router;