import { PrismaClient } from './src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  const inventories = await prisma.inventory.findMany({
    include: {
      warehouse: true,
      product: true
    }
  });
  console.log('--- Current Inventories ---');
  inventories.forEach(inv => {
    console.log(`${inv.warehouse.name} | ${inv.product.name}: ${inv.stock}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
