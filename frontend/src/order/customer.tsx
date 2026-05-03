import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import { SelectedItem } from "../models/selectItem";

const LIBRARIES: ("places")[] = ["places"];

export default function Customer() {
  const locationState = useLocation().state as { selectedItems: SelectedItem[] } | null;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [mapLocation, setMapLocation] = useState({ lat: 13.7563, lng: 100.5018 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Guard clause — redirect if no order state
  if (!locationState?.selectedItems) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-lg p-10 text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Order Found</h2>
          <p className="text-slate-500 text-sm mb-6">Please start from the order page first.</p>
          <button
            onClick={() => navigate("/order")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition-colors"
          >
            Go to Order
          </button>
        </div>
      </main>
    );
  }

  const { selectedItems } = locationState;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapLocation({ lat, lng });
    setPlaceName(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMapLocation({ lat, lng });
    setPlaceName(place.formatted_address || place.name || "Unknown location");
  };

  const isFormValid = name.trim() !== "" && email.trim() !== "" && placeName !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    const customerData = { name, email, phone, address: placeName, location: mapLocation };
    setTimeout(() => {
      navigate("/summary", { state: { customerData, selectedItems } });
    }, 800);
  };

  const totalItems = selectedItems.length;
  const totalPrice = selectedItems.reduce((sum, i) => sum + i.total, 0);

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Details
              </h1>
              <p className="text-slate-500 text-sm mt-1 ml-13">Step 2 of 3 — Fill in delivery information</p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">1</span>
              Select Products
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="flex items-center gap-1.5 text-green-600 font-bold">
              <span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              Customer Info
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
              Summary
            </span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT: Form + Order Mini-summary */}
          <div className="lg:col-span-2 space-y-4">

            {/* Customer Info Card */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Information
              </h2>
              <div className="space-y-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone <span className="text-slate-300 font-normal normal-case">(optional)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+66 8x xxx xxxx"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                {/* Selected Address */}
                {placeName && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wide mb-0.5">Delivery Address</p>
                      <p className="text-sm text-slate-700 font-medium">{placeName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Overview Card */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Order Overview
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-full">
                  {totalItems} item{totalItems !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                        {item.product.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.product.name}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      ฿{item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-xl font-extrabold text-green-600">
                  ฿{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                isFormValid && !isSubmitting
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Continue to Summary
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Map */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col">

              {/* Map Card Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Location
                </h2>
                <span className="text-xs text-slate-500 font-medium">Search or click on map to pin</span>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-slate-100">
                <LoadScript
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
                  libraries={LIBRARIES}
                  onLoad={() => setMapLoaded(true)}
                >
                  <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                    <div className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search delivery address..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-slate-800"
                      />
                    </div>
                  </Autocomplete>

                  {/* Map */}
                  <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                    {!mapLoaded ? (
                      <div className="h-[420px] bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="w-8 h-8 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
                        <p className="text-sm font-medium">Loading map...</p>
                      </div>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "420px" }}
                        center={mapLocation}
                        zoom={13}
                        onClick={handleMapClick}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: true,
                          zoomControl: true,
                        }}
                      >
                        <Marker
                          position={mapLocation}
                          animation={2} // DROP animation
                        />
                      </GoogleMap>
                    )}
                  </div>

                  {/* Coordinates Row */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>Lat: <span className="text-slate-600 font-bold">{mapLocation.lat.toFixed(5)}</span></span>
                    <span>Lng: <span className="text-slate-600 font-bold">{mapLocation.lng.toFixed(5)}</span></span>
                    <span className="text-slate-300">Click on map to adjust pin</span>
                  </div>
                </LoadScript>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}