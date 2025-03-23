import express from "express";
import cors from "cors";
import stockRoutes from "./routes/index";  

const app = express();

app.use(express.json());
app.use(cors()); 
app.use("/api/search", stockRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});

//กูลงละนะ งงเลย