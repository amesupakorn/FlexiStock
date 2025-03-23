import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());


// เพิ่ม Proxy Middleware สำหรับแต่ละ Microservice
const services = [
  { route: "/api/orders", target: "http://localhost:5002" },
  { route: "/api/inventory", target: "http://localhost:5003" },
  { route: "/api/fetchdata", target: "http://localhost:5004" },
  { route: "/api/track", target: "http://localhost:5005" },
  { route: "/api/search", target: "http://localhost:5006" },
  { route: "/api/forecast", target: "http://localhost:5007" }
];

// ใช้ Loop เพื่อลดการเขียนซ้ำ
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "/" },
    })
  );
});

app.get("/", (req, res) => {
  res.send("Hello, API is running!");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});