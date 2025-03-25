import express from "express";
import cors from "cors";
import trackRoutes from "./routes/track"; 

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/", trackRoutes); // ✅ เส้นทางที่รวม /track/:orderId อยู่ในนี้

app.listen(5005, () => {
  console.log("Track-service is running on port 5005");
});
