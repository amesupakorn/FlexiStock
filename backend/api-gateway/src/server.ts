import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

// กำหนด CORS ให้ Frontend สามารถเชื่อมต่อกับ API Gateway ได้
app.use(cors({ origin: "http://localhost:5173" }));  // ใช้ Cors ให้ Frontend ที่รันบนพอร์ต 5173

app.use(express.json());

// เส้นทาง Proxy สำหรับ Microservices
app.use("/api/orders", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));
app.use("/api/inventory", createProxyMiddleware({ target: "http://localhost:5003", changeOrigin: true }));
app.use("/api/customers", createProxyMiddleware({ target: "http://localhost:5004", changeOrigin: true }));
app.use("/api/track", createProxyMiddleware({ target: "http://localhost:5005", changeOrigin: true }));

// Route สำหรับทดสอบว่า API Gateway ทำงาน
app.get('/', (req, res) => {
  res.send('Hello, API is running!');
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});