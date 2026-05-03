import { PrismaClient } from './src/database/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Boosting inventory levels to match capacity...');

  const inventoryItems = await prisma.inventory.findMany({
    include: { warehouse: true, product: true }
  });

  for (const item of inventoryItems) {
    // Set stock to a healthier level based on capacity
    // wh-bkk-01: 10000 capacity -> ~800-1200 stock
    // wh-chon-01: 5000 capacity -> ~400-600 stock
    const baseStock = item.warehouseId === 'wh-bkk-01' ? 800 : 400;
    const randomBoost = Math.floor(Math.random() * 200);
    const newStock = baseStock + randomBoost;

    await prisma.inventory.update({
      where: { id: item.id },
      data: { 
        stock: newStock,
        maxStock: baseStock * 2 
      }
    });
    
    console.log(`✅ Updated ${item.product.name} at ${item.warehouse.name}: ${newStock} units`);
  }

  console.log('✨ Inventory levels boosted successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
