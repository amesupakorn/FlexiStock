
import express from "express";
import cors from "cors";
import DataRoutes from "./routes/index";  

const app = express();

app.use(express.json());
app.use(cors()); 

app.use("/", DataRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`fetchData Service running on http://localhost:${PORT}`);
});

