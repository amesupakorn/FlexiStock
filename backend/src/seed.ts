import prisma from "../src/lib/prisma";

async function seedDatabase() {
  // ✅ เพิ่มคลังสินค้า
  await prisma.warehouse.createMany({
    data: [
      { name: "Main Warehouse", location: "Bangkok", capacity: 10000 },
      { name: "Secondary Warehouse", location: "Chiang Mai", capacity: 5000 },
      { name: "Eastern Warehouse", location: "Pattaya", capacity: 7000 },
    ],
  });

  // ✅ เพิ่มสินค้า
  await prisma.product.createMany({
    data: [
      { name: "Laptop", description: "High-end gaming laptop", price: 35000 },
      { name: "Smartphone", description: "Flagship phone", price: 25000 },
      { name: "Tablet", description: "Lightweight tablet", price: 15000 },
      { name: "Smartwatch", description: "Wearable fitness tracker", price: 5000 },
      { name: "Headphones", description: "Noise-canceling headphones", price: 8000 },
    ],
  });

  // ✅ เพิ่มลูกค้า
  await prisma.customer.createMany({
    data: [
      { name: "John Doe", email: "john@example.com" },
      { name: "Jane Smith", email: "jane@example.com" },
      { name: "Michael Johnson", email: "michael@example.com" },
    ],
  });

  console.log("✅ Data inserted successfully!");
}

seedDatabase()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });