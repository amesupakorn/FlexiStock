import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { ChevronLeft } from "lucide-react"; // Adding an icon for the back button
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import { SelectedItem } from "../models/selectItem";

export default function Customer() {
  // รับข้อมูลจาก state ที่ส่งมาจากหน้า Order

  const [placeName, setPlaceName] = useState("");

  const { selectedItems } = useLocation().state as { selectedItems: SelectedItem[] };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState({ lat: 13.7563, lng: 100.5018 }); // Default to Bangkok
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMapClick = (e: any) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handlePlaceChanged = () => {
  if (autocomplete !== null) {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setLocation({ lat, lng });
    setPlaceName(place.formatted_address || place.name || "Unknown location");
  }
};

  const handleSubmit = () => {
    setIsSubmitting(true);
    // เก็บข้อมูล Customer และ Order ในฐานข้อมูล
    const customerData = {
      name,
      email,
      address : placeName,
      location, // ตำแหน่งที่ปักหมุด
    };
    
    console.log("Customer Data: ", customerData);
    console.log("Order Data: ", selectedItems);
    
    // Simulate processing time
    setTimeout(() => {
      navigate("/summary", { state: { customerData, selectedItems } });
    }, 800);
    // ส่งข้อมูลไปที่ backend สำหรับบันทึกข้อมูล
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <main className="flex flex-col min-h-screen p-4 md:p-8">
      <div className="w-full bg-white rounded-3xl shadow-xl mx-auto overflow-hidden border border-gray-100">
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 relative">
          <button 
            onClick={handleGoBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Customer Information
            </h1>
            <p className="text-green-100 mt-2">Provide customer delivery details</p>
          </div>
        </div>

        {/* Rest of the component remains the same as the original */}
        {/* Main Content */}
        <div className="p-6 md:p-10">
          {/* Left - Customer Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter customer full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>
            </div>

          
          </div>

          {/* Right - Location Picker */}
          <div className="space-y-4 mt-10">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Pin customer Delivery Location</h2>
                <span className="text-sm text-gray-500">Search or click on map to set location</span>
            </div>

            <LoadScript googleMapsApiKey="AIzaSyDlOE8vlYCnaOdeG1JWZ4TZt_xCzKiZv6w" libraries={['places']}>
                <Autocomplete onLoad={setAutocomplete} onPlaceChanged={handlePlaceChanged}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for customer location"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                </Autocomplete>

                <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-md">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "350px" }}
                    center={location}
                    zoom={12}
                    onClick={handleMapClick}
                >
                    <Marker position={location} />
                    <InfoWindow position={location}>
                    <div className="p-2">
                        <p className="font-medium text-green-600">Delivery Location</p>
                        <p className="text-sm text-gray-600">Lat: {location.lat.toFixed(6)}</p>
                        <p className="text-sm text-gray-600">Lng: {location.lng.toFixed(6)}</p>
                    </div>
                    </InfoWindow>
                </GoogleMap>
                </div>
            </LoadScript>
            </div>
        </div>

        {/* Submit Button */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name || !email || !placeName}
            className={`w-full p-4 text-white text-lg font-medium rounded-lg transition-all flex items-center justify-center space-x-2
              ${(isSubmitting || !name || !email || !placeName) 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105 shadow-lg'}`}
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