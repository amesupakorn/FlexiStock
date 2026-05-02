import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Product, Inventory, Warehouse } from "../models/product";
import { fetchSearchProducts, fetchSearchResults, fetchSearchWarehouses } from "../api/fetchSearch";  

export default function Search() {
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [results, setResults] = useState<(Product | Inventory)[]>([]);
  const [searchType, setSearchType] = useState<"product" | "inventory">("product");

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

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
    setIsSearching(true);
    try {
      const response = await fetchSearchResults({ productId, warehouseId, searchType });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getStockBadgeColor = (stock: number, maxStock: number = 100) => {
    const ratio = stock / maxStock;
    if (ratio < 0.3) return 'bg-red-50 text-red-600';
    if (ratio < 0.7) return 'bg-amber-50 text-amber-600';
    return 'bg-green-50 text-green-600';
  };
  
  if (loading) {
    return <div className="p-6 text-slate-600">Loading...</div>;
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Advanced Search
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <div className="flex flex-col space-y-4">
            
            {/* Tabs for Search Type */}
            <div className="flex space-x-2 border-b border-gray-100 pb-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  searchType === 'product' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => { setSearchType('product'); setResults([]); setWarehouseId(""); }}
              >
                Search Products
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  searchType === 'inventory' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => { setSearchType('inventory'); setResults([]); }}
              >
                Search Inventory
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex-grow min-w-[200px]">
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Products</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {searchType === "inventory" && (
                <div className="flex-grow min-w-[200px]">
                  <select
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">All Warehouses</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <FaSearch />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {results.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                  
                  {searchType === "product" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                    </>
                  )}
                  
                  {searchType === "inventory" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Warehouse</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
                    </>
                  )}
                  
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              
              <tbody>
                {results.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-indigo-600 font-bold">
                            {(item.product?.name || item.name || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.product?.name || item.name}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[150px]">
                            SKU: {item.product?.id || item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {searchType === "product" && (
                      <>
                        <td className="px-4 py-3 text-sm text-slate-600">{item.description || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-slate-800">
                          ฿{parseFloat(item.price || 0).toLocaleString()}
                        </td>
                      </>
                    )}
                    
                    {searchType === "inventory" && (
                      <>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4h1m4 0h1m-1-4h1m-1 4h1v5m-5-9h5v5h-5V7z" />
                            </svg>
                            {item.warehouse?.location} ({item.warehouse?.name})
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStockBadgeColor(item.stock, item.maxStock || 100)}`}>
                            {item.stock} {item.maxStock ? `/ ${item.maxStock}` : ''}
                          </span>
                        </td>
                      </>
                    )}
                    
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {item.date || item.updatedAt ? new Date(item.date || item.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-slate-900">No results found</h3>
              <p className="mt-1 text-slate-500">Try adjusting your filters and click search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}