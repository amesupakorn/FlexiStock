import express from "express";
import cors from "cors";
import { startSendEmailTrackingConsumer } from "./service/rabbitMqService";
// import notiRoute from "./routes/productRoutes";  

const app = express();

app.use(express.json());
app.use(cors()); 

startSendEmailTrackingConsumer()

// app.use("/", notiRoute);


const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Inventory Service running on http://localhost:${PORT}`);
});

