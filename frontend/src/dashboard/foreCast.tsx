
import React, { useEffect, useState } from 'react';
import { fetchForecast } from "../api/fetchForecast"
import { ForecastPoint } from '../models/forecast';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
;


const ForeCast = () => {
    const [forecast, setForecast] =  useState<ForecastPoint[]>([]);;
    const [loading, setLoading] = useState(false);
 
      useEffect(() => {
        fetchForecast()
          .then(data => {
            setForecast(data);
            setLoading(false);
          })
          .catch(err => {
            console.error("Failed to load forecast", err);
            setLoading(false);
          });
      }, []);
    
    
      if (loading) return <p>Loading forecast...</p>;
    

      return (
        <div className="p-6 space-y-10">
          <h1 className="text-2xl font-bold p-4 bg-white shadow rounded-xl border-l-4 border-blue-500">
            📈 Inventory Forecast per Product & Warehouse
          </h1>
    
          {Object.entries(forecast).map(([key, data]) => {
            const { warehouse_id, product_id } = data[0];
            return (
              <div key={key} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  🏭 Warehouse: <span className="text-blue-600">{warehouse_id}</span> |
                  🧾 Product: <span className="text-green-600">{product_id}</span>
                </h2>
    
                {/* 📊 Chart */}
                <div className="bg-white shadow rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                      <XAxis dataKey="ds" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="yhat" stroke="#2563eb" />
                      <Line type="monotone" dataKey="yhat_upper" stroke="#10b981" strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="yhat_lower" stroke="#ef4444" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
    
                {/* 📋 Table */}
                <div className="overflow-x-auto bg-white shadow rounded-xl">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-blue-700">Forecast (yhat)</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-green-700">Lower Bound</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-red-700">Upper Bound</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((point, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-800">{new Date(point.ds).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-sm text-blue-700">{point.yhat.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-green-700">{point.yhat_lower.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm text-red-700">{point.yhat_upper.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

export default ForeCast