import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../api/fetchOrder";
import { handleAlert } from "../components/swifAlert";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  product: {
    name: string;
  };
  warehouse: {
    name: string;
  };
  quantity: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  trackings: Array<{
    status: string;
    location: string;
    updatedAt: string;
  }>;
}

type TrackingStatusType = 'Processing' | 'InTransit' | 'Delivered' | 'Delayed';

const TrackingStatus: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHub, setSelectedHub] = useState("All Hubs");
  const [selectedProduct, setSelectedProduct] = useState("All Products");
  const [hubOptions, setHubOptions] = useState<string[]>([]);
  const [productOptions, setProductOptions] = useState<string[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);

      // Extract unique Hubs and Products
      const hubs = Array.from(new Set(data.map((order: Order) => order.warehouse?.name).filter(Boolean)));
      setHubOptions(["All Hubs", ...hubs as string[]]);

      const products = Array.from(new Set(data.map((order: Order) => order.product?.name).filter(Boolean)));
      setProductOptions(["All Products", ...products as string[]]);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      handleAlert({ title: "Failed to fetch orders", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesHub = selectedHub === "All Hubs" || order.warehouse?.name === selectedHub;
      const matchesProduct = selectedProduct === "All Products" || order.product?.name === selectedProduct;

      return matchesSearch && matchesHub && matchesProduct;
    });
  }, [orders, searchQuery, selectedHub, selectedProduct]);

  // Paginated Data
  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOrders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedHub, selectedProduct, rowsPerPage]);

  useEffect(() => {
    fetchOrders();
  }, []);


  const getUnifiedStatus = (order: Order) => {
    // If we have a tracking record, use its status as it's more specific for delivery
    if (order.trackings?.[0]) {
      return order.trackings[0].status;
    }
    // Fallback to order status
    return order.status;
  };

  const getUnifiedStatusColor = (status: string) => {
    switch (status) {
      // Order Statuses
      case "Pending": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Processing": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Shipped": return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case "Delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Cancelled": return "bg-rose-50 text-rose-600 border-rose-100";
      
      // Tracking Statuses (In case they differ)
      case "InTransit": return "bg-purple-50 text-purple-600 border-purple-100";
      case "Delayed": return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (loading && orders.length === 0) {
    return <div className="p-6 text-gray-600">Loading orders...</div>;
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Delivery & Tracking
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/order')}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Order
            </button>
          </div>
        </div>

        {/* Filter Bar (Inventory Style) */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Box */}
            <div className="relative flex-grow w-full lg:min-w-[300px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by ID, Customer, or Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Hub Filter */}
            <div className="w-full lg:w-64">
              <div className="relative">
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm appearance-none bg-white cursor-pointer"
                >
                  {hubOptions.map(hub => (
                    <option key={hub} value={hub}>{hub}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Filter */}
            <div className="w-full lg:w-64">
              <div className="relative">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm appearance-none bg-white cursor-pointer"
                >
                  {productOptions.map(prod => (
                    <option key={prod} value={prod}>{prod}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Clear All Button */}
            {(searchQuery || selectedHub !== "All Hubs" || selectedProduct !== "All Products") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedHub("All Hubs");
                  setSelectedProduct("All Products");
                }}
                className="text-sm font-bold text-green-600 hover:text-green-700 whitespace-nowrap px-2 transition-colors"
              >
                Clear Filters
              </button>
            )}

            {/* Rows Per Page Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Rows:</span>
              <select 
                value={rowsPerPage} 
                onChange={(e) => setRowsPerPage(Number(e.target.value))} 
                className="pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-xs font-bold bg-white appearance-none cursor-pointer"
              >
                {[10, 20, 30, 50].map((val) => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  {[
                    'Order ID',
                    'Customer',
                    'Destination',
                    'Product / Qty',
                    'Logistics Hub',
                    'Total Price',
                    'Tracking Status',
                    'Actions'
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-slate-500 font-medium">
                      {searchQuery ? `No results found for "${searchQuery}"` : "No orders found matching your criteria."}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      {/* ID & Date */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 leading-none mb-1">
                            {order.id.slice(0, 12)}...
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{order.customer?.name}</div>
                        <div className="text-xs text-slate-500">{order.customer?.email}</div>
                      </td>

                      {/* Destination */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2 max-w-[200px]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {order.customer?.address}
                          </span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{order.product?.name}</span>
                          <span className="text-xs text-slate-500">Qty: {order.quantity}</span>
                        </div>
                      </td>

                      {/* Warehouse */}
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {order.warehouse?.name}
                      </td>

                      {/* Total Price */}
                      <td className="px-6 py-4 text-sm font-black text-slate-900">
                        ฿{parseFloat(order.totalPrice).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-bold border ${getUnifiedStatusColor(getUnifiedStatus(order))}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                            {getUnifiedStatus(order)}
                          </span>
                          {order.trackings?.[0]?.location && (
                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {order.trackings[0].location}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/track?orderId=${order.id}`)}
                          className="group flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-200 font-bold text-sm"
                          title="View Details & Update"
                        >
                          <span>Track</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-white px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-tight">
              Showing <span className="text-slate-900">{(currentPage - 1) * rowsPerPage + 1}</span> - <span className="text-slate-900">{Math.min(currentPage * rowsPerPage, filteredOrders.length)}</span> of <span className="text-slate-900">{filteredOrders.length}</span> Orders
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl border border-slate-200 transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 rounded-xl border border-slate-200 transition-all ${currentPage === totalPages || totalPages === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
};

export default TrackingStatus;
