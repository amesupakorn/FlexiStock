import express from "express";
import cors from "cors";
import forecastRoutes from "./routes/forecastRoute";  
import warehouseRoutes from "./routes/warehouseRoutes";  
import bodyParser from "body-parser";

const app = express();

app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' }));

app.use("/", forecastRoutes);
app.use("/", warehouseRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`forecast Service running on http://localhost:${PORT}`);
});

