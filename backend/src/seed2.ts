import prisma from "../src/lib/prisma";

async function seedDatabase() {


  // ✅ เพิ่มสินค้าคงคลัง (Inventory) ใส่ id เอง
  await prisma.inventory.createMany({
    data: [
      {
          warehouseId: "21a1f15b-45d5-4bb4-9224-92fb83532e1d", productId: "5ae3f604-daec-448d-9968-7fb107328727", 
          stock: 50,
          minStock: 5,
          maxStock: 60
      },
      {
          warehouseId: "3a70d94b-019d-49a9-bbf5-6c8f3fe7ee8a", productId: "73283d7b-564f-41e4-bfc2-f17387991bdf", stock: 30,
          minStock: 5,
          maxStock: 50
      },
      {
          warehouseId: "3a70d94b-019d-49a9-bbf5-6c8f3fe7ee8a", productId: "aa58641b-7172-40a3-a1cc-c1ae65b3d0a8", stock: 20,
          minStock: 5,
          maxStock: 40
      },
      {
          warehouseId: "3c719003-1171-4d26-83ec-174d7910d8e8", productId: "ac1d05be-7d6f-4e00-9b78-4ca907da4298", stock: 50,
          minStock: 5,
          maxStock: 100
      },
      {
          warehouseId: "3c719003-1171-4d26-83ec-174d7910d8e8", productId: "d3cbbe43-a6fa-4efe-82fc-22ed2b42f213", stock: 60,
          minStock: 5,
          maxStock: 80
      },
    ],
  });
}

seedDatabase()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });