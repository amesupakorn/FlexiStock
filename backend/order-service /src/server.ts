import express from "express";
import cors from "cors";
import orderskRoutes from "./routes/index";  

const app = express();

app.use(express.json());
app.use(cors()); 

app.use("/api/orders", orderskRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});