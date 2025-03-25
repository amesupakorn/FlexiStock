import express from "express";
import cors from "cors";
import dataRoute from "./routes/index";  
import productRoutes from "./routes/productRoutes";  
import inventoryRoutes from "./routes/inventoryRoute";  
import { startInventoryConsumer } from "./services/rabbitMqService";

const app = express();

app.use(express.json());
app.use(cors()); 

startInventoryConsumer()

app.use("/", dataRoute);
app.use("/", inventoryRoutes);
app.use("/", productRoutes);


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});

