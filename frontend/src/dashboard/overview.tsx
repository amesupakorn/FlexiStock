import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { fetchForecast } from "../api/fetchForecast"
import { ForecastPoint } from '../models/forecast';
import { useEffect, useState } from "react";

const chartData = [
  { month: "January", dataOne: 20, dataTwo: 10 },
  { month: "February", dataOne: 40, dataTwo: 30 },
  { month: "March", dataOne: 60, dataTwo: 45 },
  { month: "April", dataOne: 50, dataTwo: 50 },
  { month: "May", dataOne: 65, dataTwo: 60 },
  { month: "June", dataOne: 80, dataTwo: 70 },
  { month: "July", dataOne: 60, dataTwo: 55 },
  { month: "August", dataOne: 30, dataTwo: 20 },
];

const tasks = [
    { title: "Meeting with Elizs", date: "04 March 19", completed: false },
    { title: "Meeting with Elizs", date: "04 March 19", completed: true },
    { title: "Meeting with Elizs", date: "04 March 19", completed: false },
  ];

const Overview = () => {
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

     if (loading) return <p className="p-4">Loading forecast...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 p-4 border-l-4 border-blue-500 bg-white shadow rounded-md text-gray-800">
        📦 Inventory Forecast Overview
      </h2>

      {/* 🔹 Chart Section: เรียงแนวนอน */}
      <div className="flex flex-wrap gap-6">
        {Object.entries(forecast).map((entry) => {
          const [warehouseId, data] = entry as unknown as [string, ForecastPoint[]];
          const avg = data.reduce((sum, d) => sum + d.yhat, 0) / data.length;
          const peak = data.reduce((max, d) => (d.yhat > max.yhat ? d : max));
          const maxUpper = Math.max(...data.map((d) => d.yhat_upper));

          return (
            <div
              key={warehouseId}
              className="w-full md:w-[500px] bg-white rounded-xl shadow p-4"
            >
              <h3 className="text-lg font-semibold mb-1">
                🏭 {warehouseId}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Avg: <strong>{avg.toFixed(1)}</strong> | Peak:{" "}
                <strong>{peak.ds}</strong> | Safety Stock:{" "}
                <strong>{maxUpper.toFixed(0)}</strong>
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <XAxis dataKey="ds" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="yhat" stroke="#2563eb" />
                  <Line
                    type="monotone"
                    dataKey="yhat_upper"
                    stroke="#10b981"
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="yhat_lower"
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;