import amqp from "amqplib";
import { sendEmail } from "../controllers/sendEmailTracking";

const QUEUE_NAME = "create_tracking";

export async function startSendEmailTrackingConsumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log("📥 Waiting for tracking jobs...");

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const { orderId, customer, tracking } = data;

    try {
      await sendEmail({
        to: customer.email,
        name: customer.name,
        orderId,
        status: tracking.status,
        location: tracking.location,
      });

      console.log(`📧 Email sent to ${customer.email} for order ${orderId}`);
      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
    }
  });
}