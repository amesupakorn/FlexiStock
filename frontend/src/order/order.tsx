/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Product, Inventory, Warehouse } from "../models/product"; // Update your Product and Inventory types

export default function Order() {
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [results, setResults] = useState<(Product | Inventory)[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [hasProductData, setHasProductData] = useState(false);
  const [hasInventoryData, setHasInventoryData] = useState(false);

  // โหลดข้อมูล Product และ Warehouse
  useEffect(() => {
    axios.get("http://localhost:5002/api/orders/getproducts")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));

    axios.get("http://localhost:5002/api/orders/getwarehouses")
      .then(response => setWarehouses(response.data))
      .catch(error => console.error("Error fetching warehouses:", error));
  }, []);

  // ค้นหาข้อมูล
  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/orders", {
        params: { productId, warehouseId },
      });

      if (response.data.length === 0) {
        console.warn("No matching results found");
      } else {
        // ตรวจสอบว่ามีข้อมูลประเภทไหนบ้าง
        const hasProduct = response.data.some((item: any) => "price" in item);
        const hasInventory = response.data.some((item: any) => "stock" in item);
        setHasProductData(hasProduct);
        setHasInventoryData(hasInventory);
      }

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  // ฟังก์ชันกดสั่งซื้อสินค้า
  const handleOrder = async (item: any) => {
    try {
      const orderData = {
        productId: item.id || item.product?.id,
        warehouseId: item.warehouse?.id || warehouseId,
        quantity: 1, // กำหนดจำนวนที่ต้องการสั่งซื้อ (สามารถแก้ไขเป็น input field ได้)
      };

      console.log("🛒 Ordering product:", orderData);

      await axios.post("http://localhost:5002/api/orders/place", orderData);

      alert(`✅ Order placed for ${item.product?.name || item.name}!`);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("❌ Failed to place order.");
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-left text-green-600 mb-10">
        Check Product & Inventory Stock Status
      </h1>

      <div className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-lg">
        {/* ค้นหา Product */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Select Product</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Warehouse */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Select Warehouse</label>
          <select
            value={warehouseId}
            onChange={(e) => setWarehouseId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>

        {/* ปุ่มค้นหา */}
        <button
          onClick={handleSearch}
          className="w-full mt-6 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <FaSearch />
          Search
        </button>

        {/* แสดงผลการค้นหา */}
        <div className="mt-8 overflow-x-auto">
          {results.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-gray-300 px-4 py-3">Name</th>
                  {hasProductData && (
                    <>
                      <th className="border border-gray-300 px-4 py-3">Description</th>
                      <th className="border border-gray-300 px-4 py-3">Price</th>
                    </>
                  )}
                  {hasInventoryData && (
                    <>
                      <th className="border border-gray-300 px-4 py-3">Warehouse</th>
                      <th className="border border-gray-300 px-4 py-3">Stock</th>
                    </>
                  )}
                  <th className="border border-gray-300 px-4 py-3">Date</th>
                  <th className="border border-gray-300 px-4 py-3">Order</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item: any, index: number) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-3">{item.product?.name || item.name}</td>
                    {hasProductData && (
                      <>
                        <td className="border border-gray-300 px-4 py-3">{item.description || "-"}</td>
                        <td className="border border-gray-300 px-4 py-3 text-green-600">
                          {item.price ? `$${parseFloat(item.price).toFixed(2)}` : "-"}
                        </td>
                      </>
                    )}
                    {hasInventoryData && (
                      <>
                        <td className="border border-gray-300 px-4 py-3">{item.warehouse?.name || "-"}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.stock ?? "-"}</td>
                      </>
                    )}
                    <td className="border border-gray-300 px-4 py-3">{item.date || new Date().toLocaleDateString()}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <button
                        onClick={() => handleOrder(item)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-4">No matching results found</p>
          )}
        </div>
      </div>
    </main>
  );
}