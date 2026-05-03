import { PrismaClient } from './src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  const warehouses = await prisma.warehouse.findMany();
  console.log('--- Current Warehouses ---');
  console.log(JSON.stringify(warehouses, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
