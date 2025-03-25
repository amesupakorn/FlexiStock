// src/services/rabbitMqService.ts (ใน forecast-service)
import amqp from 'amqplib';
import { saveForecastData } from '../controllers/forecastData'; 
import { ForecastPoint } from '../database/model/forecast';

const RABBITMQ_URL = 'amqp://localhost';  // URL ของ RabbitMQ server
const QUEUE_NAME = 'forecast_queue';  // ชื่อของ queue ที่ใช้ใน RabbitMQ

export const listenForForecastData = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    console.log(`Waiting for messages in ${QUEUE_NAME}...`);

    // When a message is received from the queue
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const forecastData = JSON.parse(msg.content.toString());
        console.log("Received forecast data:", forecastData);

        // Assuming forecastData.data is an object where keys are 'warehouse_id-product_id'
        const transformedData = Object.entries(forecastData.data).map(([key, value]) => {
          // Assume value is an array, so cast it to the expected type
          const [warehouse_id, product_id] = key.split("-");
          
          // Cast value to ForecastPoint[]
          const forecastArray = value as ForecastPoint[];

          return forecastArray.map((forecast) => ({
            forecastDate: forecast.ds,  // วันที่
            yhat: forecast.yhat,  // ค่าพยากรณ์
            yhat_lower: forecast.yhat_lower,  // ขอบล่าง
            yhat_upper: forecast.yhat_upper,  // ขอบบน
            product_id: product_id,  // รหัสสินค้า
            warehouse_id: warehouse_id,  // รหัสคลังสินค้า
          }));
        }).flat(); // ใช้ .flat() เพื่อให้เป็นอาร์เรย์เดี่ยวๆ
        
        // Save the forecast data into the database
        await saveForecastData(transformedData);

        // Acknowledge the message
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error receiving message from RabbitMQ:", error);
  }
};