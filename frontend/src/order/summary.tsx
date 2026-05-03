import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, getNearestWarehouse } from "../api/fetchOrder";
import { SelectedItem } from "../models/selectItem";
import { NearestWarehouse, Warehouse } from "../models/warehouse";
import { handleAlert } from "../components/swifAlert";

export default function OrderSummary() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Guard: redirect if accessed directly
  if (!state?.customerData || !state?.selectedItems) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-lg p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Order Data</h2>
          <p className="text-slate-500 text-sm mb-6">Please complete the order flow from the beginning.</p>
          <button
            onClick={() => navigate("/order")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            Start New Order
          </button>
        </div>
      </main>
    );
  }

  const { customerData, selectedItems } = state as { customerData: { name: string; email: string; phone?: string; address: string; location: { lat: number; lng: number } }; selectedItems: SelectedItem[] };
  const customerLocation = customerData.location || { lat: 13.747, lng: 100.5223 };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouseLocation, setWarehouseLocation] = useState<null | Warehouse>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<null | NearestWarehouse>(null);
  const [warehouseLoading, setWarehouseLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!customerLocation.lat || !customerLocation.lng) return;
      setWarehouseLoading(true);
      try {
        const data = await getNearestWarehouse(customerLocation.lat, customerLocation.lng);
        if (data) {
          setNearestWarehouse(data);
          if (data.warehouse) setWarehouseLocation(data.warehouse);
        } else {
          console.warn("No nearest warehouse data returned");
        }
      } catch (err) {
        console.error("Fetch warehouse failed:", err);
      } finally {
        setWarehouseLoading(false);
      }
    };
    fetchWarehouse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const handleCreateOrder = async () => {
    if (!warehouseLocation) {
      handleAlert({ title: "Warehouse information is missing", icon: "warning" });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createOrder(customerData, selectedItems, warehouseLocation.id);
      handleAlert({ title: "Order Created Successfully", icon: "success" });
      
      // Navigate to tracking for the first order created
      if (response.orders && response.orders.length > 0) {
        navigate(`/track?orderId=${response.orders[0].id}`);
      } else {
        navigate('/tracking'); // Fallback to tracking list
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      handleAlert({ title: "Failed to create order", icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapsDirectionsUrl = warehouseLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${warehouseLocation.lat},${warehouseLocation.lng}&destination=${customerLocation.lat},${customerLocation.lng}&travelmode=driving`
    : "#";

  const mapsEmbedSrc = warehouseLocation
    ? `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${warehouseLocation.lat},${warehouseLocation.lng}&destination=${customerLocation.lat},${customerLocation.lng}&mode=driving`
    : null;

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-full mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white border border-gray-200 shadow-sm rounded-lg flex items-center justify-center text-slate-500 hover:bg-gray-50 hover:text-slate-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Order Summary
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-[52px]">Step 3 of 3 — Review and confirm</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm font-medium">
            {["Select Products", "Customer Info", "Summary"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                <span className={`flex items-center gap-1.5 ${i === 2 ? "text-green-600 font-bold" : "text-slate-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 2 ? "bg-green-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                    {i === 2 ? "✓" : i + 1}
                  </span>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT column: Customer + Delivery Info + Order Items */}
          <div className="lg:col-span-2 space-y-4">

            {/* Customer Information Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { label: "Name", value: customerData.name, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                  { label: "Email", value: customerData.email, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                  { label: "Phone", value: customerData.phone || "—", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
                  { label: "Address", value: customerData.address, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-start gap-4 px-6 py-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Stats Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Warehouse & Delivery
                </h2>
              </div>
              {warehouseLoading ? (
                <div className="px-6 py-8 flex items-center justify-center gap-3 text-slate-400">
                  <div className="w-5 h-5 border-2 border-green-100 border-t-green-500 rounded-full animate-spin" />
                  <span className="text-sm font-medium">Finding nearest warehouse...</span>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Nearest Warehouse</p>
                        <p className="text-sm font-bold text-slate-800">{warehouseLocation?.name || "—"}</p>
                        <p className="text-xs text-slate-500">{warehouseLocation?.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-slate-100">
                    <div className="px-6 py-4 text-center">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Distance</p>
                      <p className="text-2xl font-extrabold text-green-600">
                        {nearestWarehouse?.distance_km ?? "—"}
                        <span className="text-sm font-semibold text-slate-400 ml-1">km</span>
                      </p>
                    </div>
                    <div className="px-6 py-4 text-center">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Est. Time</p>
                      <p className="text-2xl font-extrabold text-green-600">
                        {nearestWarehouse?.estimated_time_mins ?? "—"}
                        <span className="text-sm font-semibold text-slate-400 ml-1">min</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Order Items
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}
                </span>
              </div>
              <table className="w-full border-collapse">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                  <tr>
                    {['Product', 'Qty', 'Subtotal'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs shrink-0">
                            {item.product.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-slate-800">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-bold">×{item.quantity}</span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800">
                        ฿{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Grand Total</span>
                <span className="text-2xl font-extrabold text-green-600">
                  ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleCreateOrder}
              disabled={isSubmitting || warehouseLoading || !warehouseLocation}
              className={`w-full py-4 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2 ${
                isSubmitting || warehouseLoading || !warehouseLocation
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Order...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confirm & Create Order
                </>
              )}
            </button>
          </div>

          {/* RIGHT column: Delivery Route Map */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Delivery Route
                </h2>
                {warehouseLocation && (
                  <a
                    href={mapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 border border-green-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in Google Maps
                  </a>
                )}
              </div>

              <div className="flex-grow p-6 flex flex-col gap-4">
                {warehouseLoading ? (
                  <div className="flex-grow bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[420px]">
                    <div className="w-8 h-8 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
                    <p className="text-sm font-medium">Loading route...</p>
                  </div>
                ) : mapsEmbedSrc ? (
                  <>
                    {/* Route pills */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800 text-xs">{warehouseLocation?.name}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-2 rounded-lg flex-grow min-w-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                        <span className="font-semibold text-green-800 text-xs truncate">{customerData.address}</span>
                      </div>
                    </div>

                    {/* Map iframe */}
                    <div className="rounded-lg overflow-hidden border border-gray-200 flex-grow">
                      <iframe
                        title="Delivery Route"
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: "420px" }}
                        loading="lazy"
                        allowFullScreen
                        src={mapsEmbedSrc}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-grow bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 min-h-[420px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-sm font-medium">Route not available</p>
                    <p className="text-xs text-slate-300">Warehouse data could not be loaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}