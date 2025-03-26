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

      await checkAndSendLowStockAlert(inventory.id);


      console.log(`✅ Inventory updated for product ${productId} at warehouse ${warehouseId}`);
      channel.ack(msg);
    } catch (error) {
      console.error("❌ Failed to update inventory:", error);
      // ไม่ ack เพื่อให้ queue ลองใหม่
    }
  });
}



export async function checkAndSendLowStockAlert(inventoryId: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: inventoryId },
    include: { product: true, warehouse: true },
  });

  if (!inventory) return;
  

  if (inventory.stock < inventory.minStock) {
    console.log(`🚨 Low stock detected: ${inventory.product.name}`);

    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "low_stock_alert"

    await channel.assertQueue(queue, { durable: true });

    const message = {
      inventoryId: inventory.id,
      productName: inventory.product.name,
      warehouseName: inventory.warehouse.name,
      stock: inventory.stock,
      minStock: inventory.minStock,
    };

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  }
}

