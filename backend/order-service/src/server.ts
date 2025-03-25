import express from "express";
import cors from "cors";
import warehouseRoutes from "./routes/warehouseRoutes";  

const app = express();

app.use(express.json());
app.use(cors()); 

app.use("/", warehouseRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Search Service running on http://localhost:${PORT}`);
});