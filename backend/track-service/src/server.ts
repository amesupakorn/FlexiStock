import express from "express";
import cors from "cors";
import trackRoutes from "./routes/trackRoute"; 
import { startTrackingConsumer } from "./services/rabbitMqService";

const app = express();

app.use(express.json());
app.use(cors()); 


startTrackingConsumer()

app.use("/", trackRoutes); 

app.listen(5005, () => {
  console.log("Track-service is running on port 5005");
});
