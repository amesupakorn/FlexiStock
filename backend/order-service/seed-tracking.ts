import { PrismaClient } from './src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding orders without tracking...');

  const ordersWithoutTracking = await prisma.order.findMany({
    where: {
      trackings: {
        none: {},
      },
    },
    include: {
        customer: true
    }
  });

  console.log(`📦 Found ${ordersWithoutTracking.length} orders without tracking.`);

  if (ordersWithoutTracking.length === 0) {
    console.log('✅ All orders already have tracking.');
    return;
  }

  const trackingsToCreate = ordersWithoutTracking.map((order) => ({
    orderId: order.id,
    status: 'Delivered' as const,
    location: order.customer?.address || 'Delivered to Customer',
    updatedAt: order.createdAt,
  }));

  console.log(`🚀 Creating ${trackingsToCreate.length} tracking records...`);

  // We have to do this in chunks because of Postgres parameters limit or just createMany
  await prisma.tracking.createMany({
    data: trackingsToCreate,
  });

  console.log('✅ Tracking records generated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
