import express from "express";
import trackRoutes from "./routes";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use("/", trackRoutes);

app.listen(PORT, () => {
  console.log(`Track-service is running on port ${PORT}`);
});
