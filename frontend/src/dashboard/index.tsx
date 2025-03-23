import React, { useEffect, useState } from 'react';
import { fetchForecast } from "../api/fetchForecast"
import { ForecastPoint } from '../models/forecast';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
;



const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [forecast, setForecast] =  useState<ForecastPoint[]>([]);;


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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📈 Inventory Forecast</h2>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <XAxis dataKey="ds" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="yhat" stroke="#8884d8" />
            <Line type="monotone" dataKey="yhat_upper" stroke="#82ca9d" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="yhat_lower" stroke="#ff7f7f" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Forecast (yhat)</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Lower Bound</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Upper Bound</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-800">{new Date(item.ds).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-sm text-blue-700">{item.yhat.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm text-green-700">{item.yhat_lower.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm text-red-700">{item.yhat_upper.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    
  );
};

export default DashboardPage;