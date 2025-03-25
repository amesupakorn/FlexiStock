import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaWarehouse, FaBox } from "react-icons/fa";
import { Product, Inventory, Warehouse } from "../models/product";
import { fetchSearchProducts, fetchSearchResults, fetchSearchWarehouses } from "../api/fetchSearch";  

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchSearchProducts(),
      fetchSearchWarehouses()
    ]).then(([productData, warehouseData]) => {
      setProducts(productData);
      setWarehouses(warehouseData);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }, []);

  const handleSearch = async () => {
    if (!productId && searchType === "product" && searchMethod === "dropdown") {
      alert("Please select a product");
      return;
    }

    try {
      const response = await fetchSearchResults({ productId, warehouseId, searchType });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    }
  };

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

  const handleSelectProduct = (product: Product) => {
    setSearchQuery(product.name);
    setProductId(product.id);
    setShowSuggestions(false);
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock <= 10) return 'bg-red-100 text-red-800 border-red-300';
    if (stock <= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
       <div className="max-w-full bg-white rounded-3xl shadow-xl mx-auto overflow-hidden border border-gray-100 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
          <h1 className="text-3xl text-white font-bold flex items-center justify-center gap-3">
            <FaBox className="text-white" />
             Product Stock Tracker
          </h1>
        </div>

        <div className="p-8 space-y-6">
          {/* Search Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FaFilter /> Search Type
              </h3>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="product"
                    checked={searchType === "product"}
                    onChange={() => setSearchType("product")}
                    className="form-radio text-green-600"
                  />
                  <span className="ml-2">Product</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    value="inventory"
                    checked={searchType === "inventory"}
                    onChange={() => setSearchType("inventory")}
                    className="form-radio text-green-600"
                  />
                  <span className="ml-2">Inventory</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FaWarehouse /> Search Method
              </h3>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="dropdown"
                    checked={searchMethod === "dropdown"}
                    onChange={() => setSearchMethod("dropdown")}
                    className="form-radio text-green-600"
                  />
                  <span className="ml-2">Dropdown</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    value="manual"
                    checked={searchMethod === "manual"}
                    onChange={() => setSearchMethod("manual")}
                    className="form-radio text-green-600"
                  />
                  <span className="ml-2">Manual Search</span>
                </label>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="space-y-4">
            {searchMethod === "dropdown" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition"
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Product</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Enter product name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition"
                />
                {showSuggestions && filteredProducts.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                      >
                        {product.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {searchType === "inventory" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Warehouse</label>
                <select
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition"
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
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-3 mt-6"
          >
            <FaSearch />
            Search Inventory
          </button>

          {/* Results Table */}
          <div className="mt-8 overflow-x-auto">
            {results.length > 0 ? (
              <div className="shadow-md rounded-lg overflow-hidden">
   <table className="w-full bg-white">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-bold">Name</th>
          
          {searchType === "product" && (
            <>
              <th className="px-4 py-3 text-left font-bold">Description</th>
              <th className="px-4 py-3 text-right font-bold">Price</th>
            </>
          )}
          
          {searchType === "inventory" && (
            <>
              <th className="px-4 py-3 text-left font-bold">Warehouse</th>
              <th className="px-4 py-3 text-right font-bold">Stock</th>
            </>
          )}
          
          <th className="px-4 py-3 text-left font-bold">Date</th>
        </tr>
      </thead>
      
      <tbody>
        {results.map((item: any, index: number) => (
          <tr key={index} className="border-b hover:bg-green-50 transition">
            <td className="px-4 py-4 font-semibold text-green-800">
              {item.product?.name || item.name}
            </td>
            
            {searchType === "product" && (
              <>
                <td className="px-4 py-4 text-gray-700">{item.description}</td>
                <td className="px-4 py-4 text-right font-bold text-green-600">
                  ${parseFloat(item.price).toFixed(2)}
                </td>
              </>
            )}
            
            {searchType === "inventory" && (
              <>
                <td className="px-4 py-4 text-gray-700">
                  {`${item.warehouse.location} (${item.warehouse?.name}) `}
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={`
                    inline-block px-3 py-1 rounded-full font-bold text-lg
                    ${getStockBadgeColor(item.stock)}
                    border-2
                  `}>
                    {item.stock}
                  </span>
                </td>
              </>
            )}
            
            <td className="px-4 py-4 text-gray-600">
              {item.date || new Date().toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-lg">No matching results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}