import prisma from "../database/prisma";
import amqp from "amqplib";

const QUEUE_NAME = "create_tracking";
const EXCHANGE_NAME = "tracking_exchange";

export async function startTrackingConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

  console.log("📥 Waiting for tracking jobs in queue:", QUEUE_NAME);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const { orderId, tracking, customer } = data;

    try {
      await prisma.tracking.create({
        data: {
          orderId,
          status: tracking.status,
          location: tracking.location,
        },
      });

      console.log("✅ Tracking created for order", orderId);

      // ส่งต่อให้ Email Consumer
      channel.publish(
        EXCHANGE_NAME,
        "",
        Buffer.from(JSON.stringify({ orderId, customer, tracking }))
      );

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to create tracking:", error);
    }
  });
}
