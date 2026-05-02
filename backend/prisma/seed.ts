import { PrismaClient } from "../inventory-service/src/database/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  // 1. Create Warehouses
  const wh1 = await prisma.warehouse.upsert({
    where: { id: "wh-bkk-01" },
    update: {},
    create: {
      id: "wh-bkk-01",
      name: "Bangkok Central Warehouse",
      location: "Bangkok",
      capacity: 10000,
    },
  });

  const wh2 = await prisma.warehouse.upsert({
    where: { id: "wh-chon-01" },
    update: {},
    create: {
      id: "wh-chon-01",
      name: "Chonburi Logistics Hub",
      location: "Chonburi",
      capacity: 5000,
    },
  });

  // 2. Create Products
  const p1 = await prisma.product.upsert({
    where: { id: "prod-laptop-01" },
    update: {},
    create: {
      id: "prod-laptop-01",
      name: "MacBook Pro 14",
      description: "M3 Chip, 16GB RAM, 512GB SSD",
      price: 69900,
    },
  });

  const p2 = await prisma.product.upsert({
    where: { id: "prod-monitor-01" },
    update: {},
    create: {
      id: "prod-monitor-01",
      name: "Dell UltraSharp 27",
      description: "4K USB-C Monitor",
      price: 24500,
    },
  });

  const p3 = await prisma.product.upsert({
    where: { id: "prod-kb-01" },
    update: {},
    create: {
      id: "prod-kb-01",
      name: "Keychron Q1",
      description: "Mechanical Keyboard",
      price: 5900,
    },
  });

  // 3. Create Inventory
  // We use create instead of createMany to be safer with relations if needed
  const inventoryData = [
    { warehouseId: wh1.id, productId: p1.id, stock: 50, minStock: 10, maxStock: 100 },
    { warehouseId: wh1.id, productId: p2.id, stock: 30, minStock: 5, maxStock: 50 },
    { warehouseId: wh1.id, productId: p3.id, stock: 100, minStock: 20, maxStock: 200 },
    { warehouseId: wh2.id, productId: p1.id, stock: 20, minStock: 5, maxStock: 50 },
    { warehouseId: wh2.id, productId: p3.id, stock: 40, minStock: 10, maxStock: 100 },
  ];

  for (const item of inventoryData) {
    await prisma.inventory.create({
      data: item,
    }).catch(() => {
        // Skip if already exists
    });
  }

  // 4. Create Customer
  const customer = await prisma.customer.upsert({
    where: { email: "somchai@example.com" },
    update: {},
    create: {
      name: "Somchai Saendee",
      email: "somchai@example.com",
      address: "123 Sukhumvit, Bangkok",
    },
  });

  // 5. Create Sample Order
  await prisma.order.create({
    data: {
      customerId: customer.id,
      productId: p1.id,
      warehouseId: wh1.id,
      quantity: 2,
      totalPrice: 139800,
      status: "Pending",
    }
  }).catch(() => {});

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
