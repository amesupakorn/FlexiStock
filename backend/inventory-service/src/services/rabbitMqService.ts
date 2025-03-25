import amqp from "amqplib";
import prisma from "../database/prisma"; // path ตามของคุณ


export async function startInventoryConsumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "inventory_update"
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    const { warehouseId, productId, quantity, type } = data;

    try {
      const inventory = await prisma.inventory.findFirst({
        where: { warehouseId, productId },
      });

      if (!inventory) {
        console.warn("Inventory not found:", data);
        return channel.ack(msg);
      }

      let newStock = inventory.stock;
      if (type === "decrease") {
        newStock = Math.max(0, inventory.stock - quantity);
      }

      await prisma.inventory.update({
        where: { id: inventory.id },
        data: { stock: newStock },
      });

      console.log(`✅ Inventory updated for product ${productId} at warehouse ${warehouseId}`);
      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to update inventory:", error);
      // ไม่ ack เพื่อให้ queue ลองใหม่
    }
  });
}

