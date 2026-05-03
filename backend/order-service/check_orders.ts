import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.order.count();
  console.log(`Total orders: ${count}`);
  const orders = await prisma.order.findMany({ take: 5 });
  console.log('Sample orders:', JSON.stringify(orders, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
