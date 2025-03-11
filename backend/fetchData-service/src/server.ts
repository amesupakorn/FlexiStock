
import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/index";  

const app = express();

app.use(express.json());
app.use(cors()); 

app.use("/api/fetchdata", inventoryRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});

