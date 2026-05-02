import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));

// NOTE: Do NOT use express.json() before the proxy routes.
// It would consume the body stream and the proxy cannot re-stream it,
// causing POST/PUT requests to hang indefinitely.

// เพิ่ม Proxy Middleware สำหรับแต่ละ Microservice
const services = [
  { route: "/api/orders", target: process.env.ORDER_SERVICE_URL || "http://localhost:5002" },
  { route: "/api/inventory", target: process.env.INVENTORY_SERVICE_URL || "http://localhost:5003" },
  { route: "/api/notification", target: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5004" },
  { route: "/api/track", target: process.env.TRACK_SERVICE_URL || "http://localhost:5005" },
  { route: "/api/search", target: process.env.SEARCH_SERVICE_URL || "http://localhost:5006" },
  { route: "/api/forecast", target: process.env.FORECAST_SERVICE_URL || "http://localhost:5007" }
];

// ใช้ Loop เพื่อลดการเขียนซ้ำ
services.forEach(({ route, target }) => {
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "/" },
      on: {
        proxyReq: (proxyReq, req: any) => {
          // Re-stream any pre-parsed body to the downstream service
          if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }
        },
      },
    })
  );
});

app.get("/", (req, res) => {
  res.send("Hello, API is running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
});