import amqp from "amqplib";
import { sendEmail } from "../controllers/sendEmailTracking";
import { sendLowStockEmail } from "../controllers/sendEmailInventory";

const QUEUE_NAME = "send_tracking_email";
const EXCHANGE_NAME = "tracking_exchange";

export async function startSendEmailTrackingConsumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, "");

  console.log("📬 Waiting for email jobs in:", QUEUE_NAME);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const data = JSON.parse(msg.content.toString());
      const { orderId, customer, tracking } = data;

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


export async function startLowStockEmailConsumer() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "low_stock_alert"

    await channel.assertQueue(queue, { durable: true });
  
    console.log("📬 Waiting for low stock alert emails...");
  
    channel.consume(queue, async (msg) => {
      if (!msg) return;
  
      try {
        const data = JSON.parse(msg.content.toString());
        await sendLowStockEmail(data);
        console.log("📧 Alert email sent:", data.productName);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to send low stock email:", err);
      }
    });
  }