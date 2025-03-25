// src/services/rabbitMqService.ts (ใน order-service)
import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';  
const QUEUE_NAME = 'forecast_queue'; 

export const sendToForecastQueue = async (data: any) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // สร้าง queue ถ้าไม่มีก่อนที่จะส่งข้อความ
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,  // ทำให้ queue มีความคงทน
    });

    // ส่งข้อความไปที่ queue
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(data)), {
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