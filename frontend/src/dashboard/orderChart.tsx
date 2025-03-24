
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
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

const OrderChart = () => {
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

    return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph */}
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Appointments History</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="dataOne" stroke="#f97316" fill="#fdba74" />
              <Area type="monotone" dataKey="dataTwo" stroke="#60a5fa" fill="#93c5fd" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Task List */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Task</h2>
            <button className="text-white bg-blue-500 px-3 py-1 rounded-full text-sm">+ Add Task</button>
          </div>
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  task.completed ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div>
                  <p
                    className={`font-medium ${
                      task.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    )
}

export default OrderChart