// src/services/rabbitMqService.ts (ใน order-service)
import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';  

export const sendToForecastQueue = async (data: any) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "forecast_queue"
    // สร้าง queue ถ้าไม่มีก่อนที่จะส่งข้อความ
    await channel.assertQueue(queue, {
      durable: true,  // ทำให้ queue มีความคงทน
    });

    // ส่งข้อความไปที่ queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,  // ทำให้ข้อความไม่หายไปเมื่อ RabbitMQ รีสตาร์ท
    });

    console.log("Message sent to forecast queue:", data);

    // ปิดการเชื่อมต่อ
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
};


export async function sendToInventoryQueue(message: any) {
  try {

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "inventory_update";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("📦 Sent to inventory queue:", message);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
}



export async function sendToTrackingQueue(message: any) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "create_tracking";
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log("🚀 Sent to create_tracking queue:", message);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    console.error("❌ Failed to send to queue:", error);
  }
}
