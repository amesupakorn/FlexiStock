import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, User, Mail, Package, Route, Clock, ChevronLeft } from "lucide-react";
import { createOrder, getNearestWarehouse } from "../api/fetchOrder";
import RouteVisualization from "../components/ui/routeDlivery"
import { SelectedItem } from "../models/selectItem";
import { NearestWarehouse, Warehouse } from "../models/warehouse";
import { handleAlert } from "../components/swifAlert";
export default function OrderSummary() {
  const { state } = useLocation();
  const { customerData } = state || {};
  const { selectedItems } = useLocation().state as { selectedItems: SelectedItem[] };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const [warehouseLocation, setWarehouseLocation] = useState<null | Warehouse>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<null | NearestWarehouse>(null);  
  
  const customerLocation = customerData?.location || { lat: 13.747, lng: 100.5223 };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const [path, setPath] = useState<any[]>([]); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);
  
  
  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!customerLocation.lat || !customerLocation.lng) return;

      try {
        const data = await getNearestWarehouse(customerLocation.lat, customerLocation.lng);
        setNearestWarehouse(data);
        if (data.warehouse) {
          setWarehouseLocation(data.warehouse);
        }
      } catch (err) {
        console.error("Fetch warehouse failed:", err);
      }
    };

    fetchWarehouse();
  }, [customerLocation]);


  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const total = selectedItems.reduce((sum, item) => sum + item.total, 0);

  useEffect(() => {
    setPath([warehouseLocation, customerLocation]);
  }, [customerLocation]);


  const handleCreateOrder = async () => {
    setIsSubmitting(true)
    try {
      
      await createOrder(customerData, selectedItems, warehouseLocation?.id);
      handleAlert({title:"Order Success", icon: "success"})
      
      navigate("/order"); 
    } catch (error) {
      console.error("Failed to create order:", error);
    }
    setIsSubmitting(false)

  };

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8">
      <div className="w-full bg-white rounded-3xl shadow-xl mx-auto overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 relative">
          <button 
            onClick={handleGoBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
                Order Summary
            </h1>
            <p className="text-green-100 mt-2">Delivery and Order Details</p>
          </div>
        </div>

        {/* Main Content */}
        {/* Google Map Section */}
        <div className="p-6">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-3 mb-4 flex items-center">
                    <Route className="mr-3 text-emerald-500" />
                    Delivery Route
                </h2>
                <div className="mt-6 border rounded-lg overflow-hidden shadow-md">
                {warehouseLocation && (

                    <iframe
                        title="Delivery Route"
                        width="100%"
                        height="450"
                        frameBorder="0"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyDlOE8vlYCnaOdeG1JWZ4TZt_xCzKiZv6w&origin=${warehouseLocation.lat},${warehouseLocation.lng}&destination=${customerLocation.lat},${customerLocation.lng}&mode=driving`}                />
                      )}
                       
                  </div>
                  {warehouseLocation && (

                    <div className="flex flex-row items-center">
                            <span> <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${warehouseLocation.lat},${warehouseLocation.lng}&destination=${customerLocation.lat},${customerLocation.lng}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:underline mt-4 inline-block"
                            >
                            เปิดเส้นทางบน Google Maps
                            </a></span>

                    </div>
                   )}

                   
                </div>
                
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 ">
          {/* Left - Customer Information */}
          <div className="space-y-6 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-300 pb-3 mb-4 flex items-center">
              <User className="mr-3 text-emerald-500" />
              Customer Information
            </h2>
            <div className="space-y-4">
              {[
                { icon: <User className="text-emerald-500" />, label: "Name", value: customerData?.name },
                { icon: <Mail className="text-emerald-500" />, label: "Email", value: customerData?.email },
                { icon: <MapPin className="text-emerald-500" />, label: "Address", value: customerData?.address },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="font-medium text-gray-600">{item.label}:</span>
                  </div>
                  <span className="text-gray-800 font-semibold text-right max-w-[200px] truncate">
                    {item.value}
                  </span>
                </div>
              ))}

                <div className="bg-white shadow-lg rounded-2xl p-4 mx-auto">
                    {/* Route Visualization */}
                    <RouteVisualization/>

                    {/* Location Details */}
                    <div className="space-y-4">
                        {/* Warehouse Location */}
                        <div className="bg-emerald-50 p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Route className="w-5 h-5 text-emerald-600" />
                            <span className="text-gray-700 font-medium">Warehouse</span>
                        </div>
                        <span className="text-emerald-800 font-semibold">{
                            `${warehouseLocation?.location} (
                            ${warehouseLocation?.lat.toFixed(4)}, ${warehouseLocation?.lng.toFixed(4)} )`}
                        </span>
                        </div>

                        {/* Customer Location */}
                        <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-700 font-medium">Customer</span>
                        </div>
                        <span className="text-blue-800 font-semibold">
                            {customerLocation.lat.toFixed(4)}, {customerLocation.lng.toFixed(4)}
                        </span>
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-purple-50 p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span className="text-gray-700 font-medium">Delivery Details</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                            <Route className="w-4 h-4 text-emerald-600 mr-1" />
                            <span className="text-emerald-800 font-semibold"> {nearestWarehouse?.distance_km} km</span>
                            </div>
                            <div className="h-4 border-r border-gray-300"></div>
                            <div className="flex items-center">
                            <Clock className="w-4 h-4 text-purple-600 mr-1" />
                            <span className="text-purple-800 font-semibold">{nearestWarehouse?.estimated_time_mins} mins</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Order Items Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                  <Package className="mr-3 text-emerald-500" />
                  Order Items
                </h2>
                <span className="text-sm text-gray-500 bg-emerald-50 px-2 py-1 rounded-full">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No items in your order
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="text-emerald-500" />
                        <span className="font-medium text-gray-700">{item.product.name}</span>
                      </div>
                      <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-lg font-semibold text-gray-700 mt-4 border-t pt-4">
                    <span>Total</span>
                    <span className="text-green-600">฿{total.toFixed(2)}</span>
                    </div>

                </div>
              )}
            </div>
          </div>
        </div>
         {/* Submit Button */}
         <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleCreateOrder}
            disabled={isSubmitting}
            className={`w-full p-4 text-white text-lg font-medium rounded-lg transition-all flex items-center justify-center space-x-2
              ${(isSubmitting) 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-101 shadow-lg'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Complete Order"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}