/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Product, Inventory, Warehouse } from "../models/product"; // Update your Product and Inventory types

export default function Search() {
  const [searchMethod, setSearchMethod] = useState<"dropdown" | "manual">("dropdown");
  const [searchQuery, setSearchQuery] = useState("");
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [results, setResults] = useState<(Product | Inventory)[]>([]);
  const [searchType, setSearchType] = useState<"product" | "inventory">("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // โหลดข้อมูล Product และ Warehouse
  useEffect(() => {
    axios.get("http://localhost:5006/api/search/getproducts")
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products:", error));

    axios.get("http://localhost:5006/api/search/getwarehouses")
      .then(response => setWarehouses(response.data))
      .catch(error => console.error("Error fetching warehouses:", error));
  }, []);

  // ค้นหาข้อมูล
  const handleSearch = async () => {
    if (!productId && searchType === "product" && searchMethod === "dropdown") {
      console.error("Product ID is required");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5006/api/search", {
        params: { productId, warehouseId, searchType },
      });

      if (response.data.length === 0) {
        console.warn("No matching results found");
      }

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

  // ฟังก์ชันค้นหา Product ด้วยการพิมพ์ (Search Result)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    if (query.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // เลือก Product จาก Search Result
  const handleSelectProduct = (product: Product) => {
    setSearchQuery(product.name);
    setProductId(product.id);
    setShowSuggestions(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
      
      <h1 className="text-3xl font-bold text-left text-green-600 mb-10 flex flex-row">
       Check Product Stock Status
      </h1>

      <div className="w-full max-w-6xl bg-white p-8 rounded-lg justify-center">
        {/* ประเภทการค้นหา */}
        <div className="mb-6">
          <label className="text-lg font-medium text-gray-700">Search Type</label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="product"
                checked={searchType === "product"}
                onChange={() => setSearchType("product")}
              />
              Product
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="inventory"
                checked={searchType === "inventory"}
                onChange={() => setSearchType("inventory")}
              />
              Inventory
            </label>
          </div>
        </div>

        {/* เลือกวิธีค้นหา */}
        <div className="mb-4">
          <label className="text-lg font-medium text-gray-700">Search Method</label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="dropdown"
                checked={searchMethod === "dropdown"}
                onChange={() => setSearchMethod("dropdown")}
              />
              Dropdown
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="manual"
                checked={searchMethod === "manual"}
                onChange={() => setSearchMethod("manual")}
              />
              Manual Search
            </label>
          </div>
        </div>

        {/* ค้นหา Product */}
        {searchMethod === "dropdown" ? (
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
        ) : (
          <div className="mb-4 relative">
            <label className="block text-lg font-medium text-gray-700">Search Product</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Enter product name..."
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
            />
            {showSuggestions && filteredProducts.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-md">
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Dropdown Warehouse */}
        {searchType === "inventory" && (
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
        )}

        {/* ปุ่มค้นหา */}
        <button
          onClick={handleSearch}
          className="w-full mt-6 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <FaSearch />
          Search
        </button>
        <div className="mt-8 overflow-x-auto">
          {results.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="border border-gray-300 px-4 py-3">Name</th>
                  {searchType === "product" && (
                    <>
                      <th className="border border-gray-300 px-4 py-3">Description</th>
                      <th className="border border-gray-300 px-4 py-3">Price</th>
                    </>
                  )}
                  {searchType === "inventory" && (
                    <>
                      <th className="border border-gray-300 px-4 py-3">Warehouse</th>
                      <th className="border border-gray-300 px-4 py-3">Stock</th>
                    </>
                  )}
                  <th className="border border-gray-300 px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item: any, index: number) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-3">{item.product?.name || item.name}</td>
                    {searchType === "product" && (
                      <>
                        <td className="border border-gray-300 px-4 py-3">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-3 text-green-600">
                          ${parseFloat(item.price).toFixed(2)}
                        </td>
                      </>
                    )}
                    {searchType === "inventory" && (
                      <>
                        <td className="border border-gray-300 px-4 py-3">{item.warehouse?.name}</td>
                        <td className="border border-gray-300 px-4 py-3">{item.stock}</td>
                      </>
                    )}
                    <td className="border border-gray-300 px-4 py-3">{item.date || new Date().toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-4">No matching results found</p>
          )}
        </div>
      </div>
      </div>
    </main>
  );
}