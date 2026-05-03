import { PrismaClient } from './src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Re-aligning tracking data with existing warehouses...');

  // Get all orders from demo customer
  const orders = await prisma.order.findMany({
    where: {
      customer: {
        email: 'demo@flexistock.com'
      }
    },
    include: {
      warehouse: true,
      customer: true
    }
  });

  console.log(`📦 Processing ${orders.length} orders...`);

  // Delete existing trackings for these orders to start fresh
  const orderIds = orders.map(o => o.id);
  await prisma.tracking.deleteMany({
    where: {
      orderId: { in: orderIds }
    }
  });

  const trackingsToCreate = [];

  for (const order of orders) {
    // 1. Initial point: Processing at Warehouse
    const processingDate = new Date(order.createdAt);
    
    trackingsToCreate.push({
      orderId: order.id,
      status: 'Processing' as const,
      location: order.warehouse.name,
      updatedAt: processingDate,
    });

    // 2. Final point: Delivered at Customer Address (some time later)
    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setHours(deliveryDate.getHours() + 24); // Delivered next day
    
    trackingsToCreate.push({
      orderId: order.id,
      status: 'Delivered' as const,
      location: order.customer?.address || 'Customer Location',
      updatedAt: deliveryDate,
    });
  }

  console.log(`🚀 Creating ${trackingsToCreate.length} tracking records...`);
  
  // Use createMany
  await prisma.tracking.createMany({
    data: trackingsToCreate,
  });

  console.log('✅ Tracking data re-aligned successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
