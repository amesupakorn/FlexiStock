import React, { useState, useEffect } from 'react';

// Define the enums since we can't import from @prisma/client directly
enum TrackingStatus {
  Processing = 'Processing',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Delayed = 'Delayed'
}

enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

const StatusBadge = ({ status }: { status: TrackingStatus }) => {
  const getColor = () => {
    switch (status) {
      case TrackingStatus.Processing:
        return 'bg-blue-100 text-blue-800';
      case TrackingStatus.InTransit:
        return 'bg-yellow-100 text-yellow-800';
      case TrackingStatus.Delivered:
        return 'bg-green-100 text-green-800';
      case TrackingStatus.Delayed:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor()}`}>
      {status === TrackingStatus.InTransit ? 'In Transit' : status}
    </span>
  );
};

interface TrackingHistoryItem {
  id: string;
  status: TrackingStatus;
  location: string | null;
  updatedAt: Date;
}

interface TrackingInfo {
  orderId: string;
  orderStatus: OrderStatus;
  customerName: string;
  trackingHistory: TrackingHistoryItem[];
  items: {
    id: string;
    productName: string;
    quantity: number;
    warehouseName: string;
  }[];
}

const TrackingPage: React.FC = () => {
  // Get URL parameters without using next/navigation
  const getQueryParam = (param: string): string | null => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
    }
    return null;
  };
  
  const orderId = getQueryParam('id');
  
  const [searchId, setSearchId] = useState<string>('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Replace this with your actual API call
  const fetchTrackingInfo = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // This would be your actual data fetching logic
      // For now, we're using mock data
      
      // Simulating API response for demonstration
      const mockData: TrackingInfo = {
        orderId: id,
        orderStatus: OrderStatus.Processing,
        customerName: 'John Doe',
        trackingHistory: [
          {
            id: '1',
            status: TrackingStatus.Processing,
            location: 'Central Warehouse',
            updatedAt: new Date('2025-03-10T08:00:00Z')
          },
          {
            id: '2',
            status: TrackingStatus.InTransit,
            location: 'Bangkok Distribution Center',
            updatedAt: new Date('2025-03-12T10:30:00Z')
          },
        ],
        items: [
          {
            id: '101',
            productName: 'Wireless Headphones',
            quantity: 2,
            warehouseName: 'Central Warehouse'
          },
          {
            id: '102',
            productName: 'Smartphone Case',
            quantity: 1,
            warehouseName: 'Eastern Warehouse'
          }
        ]
      };
      
      setTrackingInfo(mockData);
    } catch (err) {
      setError('Unable to fetch tracking information. Please check your order ID and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      setSearchId(orderId);
      fetchTrackingInfo(orderId);
    }
  }, [orderId]);

  // Set initial search ID after component mounts
  useEffect(() => {
    if (orderId) {
      setSearchId(orderId);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      // Instead of using router, we'll use a simple URL construction
      window.location.href = `/track/page?id=${searchId}`;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Supply Chain Tracking</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Track
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {trackingInfo && !loading && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{trackingInfo.orderId}</h2>
                <p className="text-gray-600">Customer: {trackingInfo.customerName}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-600">Order Status</p>
                <StatusBadge status={trackingInfo.trackingHistory[trackingInfo.trackingHistory.length - 1].status} />
              </div>
            </div>
          </div>

          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {trackingInfo.trackingHistory.map((item, index) => (
                <div key={item.id} className="flex mb-4 relative">
                  <div className={`absolute left-4 top-2 w-3 h-3 rounded-full transform -translate-x-1.5 ${
                    index === trackingInfo.trackingHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="ml-8">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      <span className="text-sm text-gray-500">{formatDate(item.updatedAt)}</span>
                    </div>
                    {item.location && (
                      <p className="text-gray-600 mt-1">Location: {item.location}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trackingInfo.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.warehouseName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;