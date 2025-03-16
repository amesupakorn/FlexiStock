import express from "express";
import cors from "cors";
// import inventoryRoutes from "./routes/index";  

const app = express();

app.use(express.json());
app.use(cors()); 

// app.use("/", inventoryRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`forecast Service running on http://localhost:${PORT}`);
});

