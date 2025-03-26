import amqp from "amqplib";
import prisma from "../database/prisma";
import { v4 as uuidv4 } from "uuid";

const QUEUE_NAME = "create_tracking";

async function startTrackingConsumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("📥 Waiting for tracking jobs...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const { orderId, status, location } = data;

    try {

      const track = await prisma.tracking.create({
        data: {
          orderId,
          status,
          location,
        },
      });

      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to create tracking:", error);
    }
  });
}

startTrackingConsumer().catch(console.error);