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

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      handleAlert({ title: "Failed to fetch orders", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            Delivery & Tracking
          </h1>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by ID, Name, or Product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => navigate('/order')}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Order
            </button>
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
                  filteredOrders.map((order) => (
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
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getUnifiedStatusColor(getUnifiedStatus(order))}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
                            {getUnifiedStatus(order)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/track?orderId=${order.id}`)}
                          className="group flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-200 font-bold text-sm"
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
        </div>
      </div>
    </main>
  )
};

export default TrackingStatus;
