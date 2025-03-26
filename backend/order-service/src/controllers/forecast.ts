import prisma from "../database/prisma";
import axios from "axios";
import { sendToForecastQueue } from '../services/rabbitMqService';

export const sendForecastData = async () => {
  // ดึงข้อมูลจากฐานข้อมูล
  try {

      const orderItems = await prisma.order.findMany({
        // กรองข้อมูลที่ต้องการ (ถ้าต้องการกรองสามารถเพิ่ม where conditions ได้)
      });

      // สร้าง Map เพื่อรวมยอดตามวันที่, productId และ warehouseId
      const grouped = new Map<string, number>();

      // ประมวลผลข้อมูลที่ดึงมาจากฐานข้อมูล
      for (const item of orderItems) {
        // แปลงวันที่ให้ตรงกับรูปแบบ 'YYYY-MM-DD'
        const ds = item.createdAt.toISOString().split("T")[0]; // หรือเปลี่ยนให้ตรงตามรูปแบบที่คุณต้องการ

        const key = `${ds}:${item.productId}:${item.warehouseId}`;
        const current = grouped.get(key) || 0;
        grouped.set(key, current + item.quantity);
      }


      // สร้างข้อมูลที่พร้อมส่งไปยัง API forecast
      const forecastData = Array.from(grouped.entries()).map(([key, y]) => {    
        const [ds, product_id, warehouse_id] = key.split(":");
        
        // ตรวจสอบว่า `split` ได้ค่าที่ถูกต้อง
        // console.log("ds:", ds, "product_id:", product_id, "warehouse_id:", warehouse_id);
        // console.log("Quantity (y):", y);
        
        // ส่งข้อมูลเพื่อใช้ในการพยากรณ์
        return { ds, y, product_id, warehouse_id };
      });

  // ส่งข้อมูลไปยัง forecast service (http://localhost:8000/forecast)
    const response = await axios.post("http://localhost:8000/forecast", forecastData);

    const forecast = { data: response.data };
    await sendToForecastQueue(forecast)

    return {
      forecastData,
      forecastResult: response.data
    };
    } catch (error) {
    console.error("Error sending forecast data:", error);
    throw error;
  }
};