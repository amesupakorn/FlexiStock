import { PrismaClient } from '../inventory-service/src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Generating historical orders for forecasting...');

  // Get existing products and warehouses
  const products = await prisma.product.findMany();
  const warehouses = await prisma.warehouse.findMany();

  if (products.length === 0 || warehouses.length === 0) {
    console.error('❌ No products or warehouses found. Run the main seed first.');
    return;
  }

  // Create a demo customer if not exists
  const customer = await prisma.customer.upsert({
    where: { email: 'demo@flexistock.com' },
    update: {},
    create: {
      name: 'Demo Business',
      email: 'demo@flexistock.com',
      address: '123 Logistics Way, Bangkok',
    },
  });

  const ordersToCreate = [];
  const now = new Date();

  // Generate data for the last 60 days
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    for (const product of products) {
      for (const warehouse of warehouses) {
        // Randomly decide if there was an order for this product/warehouse on this day
        // Higher chance for some products to create "trends"
        const chance = Math.random();
        if (chance > 0.4) {
          const quantity = Math.floor(Math.random() * 10) + 1;
          ordersToCreate.push({
            customerId: customer.id,
            productId: product.id,
            warehouseId: warehouse.id,
            quantity: quantity,
            totalPrice: Number(product.price) * quantity,
            status: 'Delivered',
            createdAt: new Date(date),
          });
        }
      }
    }
  }

  console.log(`📦 Creating ${ordersToCreate.length} orders...`);

  // Bulk create (Note: Prisma might have limits on batch size, so we'll do it in chunks)
  const chunkSize = 100;
  for (let i = 0; i < ordersToCreate.length; i += chunkSize) {
    const chunk = ordersToCreate.slice(i, i + chunkSize);
    await prisma.order.createMany({
      data: chunk as any,
    });
  }

  console.log('✅ Historical orders generated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
