import React from 'react';
import { Route, MapPin, Truck } from 'lucide-react';

const RouteVisualization = () => {
  return (
    <div className="flex items-center justify-center my-6 mx-12">
      <div className="flex items-center w-full max-w-md">
        {/* Start Point */}
        <div className="flex flex-col items-center">
          <div className="p-3 bg-emerald-100 rounded-full shadow-md mb-2">
            <Route className="w-6 h-6 text-emerald-600" />
          </div>
        </div>

        {/* Route Line */}
        <div className="flex-grow mx-4 relative">
          <div className="border-t-2 border-dashed border-emerald-300 absolute top-1/2 left-0 right-0"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow-md">
            <Truck className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
        </div>

        {/* End Point */}
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-100 rounded-full shadow-md mb-2">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualization;