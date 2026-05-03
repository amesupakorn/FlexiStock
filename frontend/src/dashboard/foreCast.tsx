import React, { useEffect, useState, useMemo } from 'react';
import { fetchForecast } from "../api/fetchForecast";
import { fetchDashboardStats } from "../api/fetchStats";
import { ForecastPoint } from '../models/forecast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { FaChartLine, FaBox, FaTruckFast, FaTriangleExclamation, FaWarehouse, FaCaretUp, FaCaretDown } from "react-icons/fa6";

const ForeCast = () => {
  const [forecast, setForecast] = useState<Record<string, Record<string, ForecastPoint[]>>>({});
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [forecastRes, statsRes] = await Promise.all([
          fetchForecast(),
          fetchDashboardStats()
        ]);

        setForecastData(forecastRes.forecastData);
        setStats(statsRes);

        if (forecastRes.forecastResult && typeof forecastRes.forecastResult === 'object') {
          const groupedByWarehouse = Object.entries(forecastRes.forecastResult).reduce(
            (acc: Record<string, Record<string, ForecastPoint[]>>, [key, values]) => {
              const forecastArray = values as any[];
              if (forecastArray.length === 0) return acc;
              const warehouse_id = forecastArray[0].warehouse_id;
              const product_id = forecastArray[0].product_id;
              
              if (!acc[warehouse_id]) acc[warehouse_id] = {};
              acc[warehouse_id][product_id] = forecastArray as ForecastPoint[];
              return acc;
            },
            {}
          );

          setForecast(groupedByWarehouse);

          if (Object.keys(groupedByWarehouse).length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(Object.keys(groupedByWarehouse)[0]);
          }
        }
      } catch (err) {
        console.error("❌ Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const warehouseNames = useMemo(() => {
    if (!stats?.warehouses) return {};
    return stats.warehouses.reduce((acc: Record<string, string>, w: any) => {
      acc[w.id] = w.name;
      return acc;
    }, {});
  }, [stats]);

  const productMap = useMemo(() => {
    if (!stats?.products) return {};
    return stats.products.reduce((acc: Record<string, string>, p: any) => {
      acc[p.id] = p.name;
      return acc;
    }, {});
  }, [stats]);

  const getWeekdayName = (date: string) => {
    const day = new Date(date).getDay();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[day];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="mt-6 text-gray-500 font-medium animate-pulse">กำลังประมวลผลข้อมูลพยากรณ์...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-green-600 rounded-xl shadow-lg shadow-green-200">
              <FaChartLine className="text-white w-6 h-6" />
            </div>
            แดชบอร์ดการวิเคราะห์และพยากรณ์
          </h1>
          <p className="text-gray-500 mt-1 ml-14">ภาพรวมธุรกิจและการพยากรณ์ความต้องการสินค้าล่วงหน้า 30 วัน</p>
        </div>
        <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-sm text-sm text-gray-500">
          อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl shadow-green-200 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <FaBox size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FaBox className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">สต็อกทั้งหมด</span>
          </div>
          <div className="text-4xl font-bold">{stats?.inventory?.totalStock?.toLocaleString() || 0}</div>
          <div className="mt-2 text-green-100 text-sm flex items-center gap-1">
            <FaCaretUp /> 12% จากเดือนที่แล้ว
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <FaTriangleExclamation size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FaTriangleExclamation className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">สินค้าสต็อกต่ำ</span>
          </div>
          <div className="text-4xl font-bold">{stats?.inventory?.lowStockItems || 0}</div>
          <div className="mt-2 text-amber-100 text-sm">ต้องการการเติมด่วน</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-200 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <FaTruckFast size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FaTruckFast className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">กำลังขนส่ง</span>
          </div>
          <div className="text-4xl font-bold">{stats?.orders?.activeShipments || 0}</div>
          <div className="mt-2 text-emerald-100 text-sm flex items-center gap-1">
            <FaCaretUp /> 5 รายการใหม่วันนี้
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <FaChartLine size={120} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FaChartLine className="w-5 h-5" />
            </div>
            <span className="font-medium opacity-90">ยอดสั่งซื้อรวม</span>
          </div>
          <div className="text-4xl font-bold">{stats?.orders?.totalOrders || 0}</div>
          <div className="mt-2 text-indigo-100 text-sm">รายการทั้งหมดในระบบ</div>
          <div className="mt-2 text-green-100 text-sm">รายการทั้งหมดในระบบ</div>
        </div>
      </div>

      {/* Forecasting Section */}
      <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-2xl shadow-gray-200/50 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <FaWarehouse className="text-green-500" />
              การพยากรณ์รายคลังสินค้า
            </h2>
            <p className="text-gray-500 mt-1">เลือกคลังสินค้าเพื่อดูการวิเคราะห์เชิงลึกและการคาดการณ์</p>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200">
            {Object.keys(forecast).map((warehouse) => (
              <button
                key={warehouse}
                onClick={() => setSelectedWarehouse(warehouse)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${selectedWarehouse === warehouse
                    ? 'bg-white text-green-600 shadow-md transform scale-105'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                  }`}
              >
                {(warehouseNames as any)[warehouse] || warehouse}
              </button>
            ))}
          </div>
        </div>

        {selectedWarehouse && forecast[selectedWarehouse] ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(forecast[selectedWarehouse]).map(([product_id, data]) => {
              const lastForecast = data[data.length - 1];
              const recommendedStockIncrease = Math.max(0, lastForecast.yhat_upper - lastForecast.yhat);

              // Calculate Trend
              const firstHalf = data.slice(0, Math.floor(data.length / 2));
              const secondHalf = data.slice(Math.floor(data.length / 2));
              const firstAvg = firstHalf.reduce((s, i) => s + i.yhat, 0) / firstHalf.length;
              const secondAvg = secondHalf.reduce((s, i) => s + i.yhat, 0) / secondHalf.length;
              const trendUp = secondAvg > firstAvg;
              const trendPercent = Math.abs(((secondAvg - firstAvg) / firstAvg) * 100).toFixed(1);

              return (
                <div key={product_id} className="bg-white/70 backdrop-blur-sm rounded-[2rem] border border-white shadow-sm hover:shadow-xl transition-all duration-500 p-6 group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-green-500 uppercase tracking-widest mb-1">Product Forecast</h3>
                      <h4 className="text-xl font-bold text-gray-800">{productMap[product_id] || product_id}</h4>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${trendUp ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {trendUp ? <FaCaretUp /> : <FaCaretDown />}
                      {trendPercent}%
                    </div>
                  </div>

                  <div className="h-[280px] w-full mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`colorYhat-${product_id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                          dataKey="ds"
                          tickFormatter={formatDate}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                          minTickGap={20}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#94a3b8', fontSize: 11 }}
                        />
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          formatter={(v: number) => [v.toFixed(2), 'ปริมาณพยากรณ์']}
                          labelFormatter={(l) => formatDate(l as string)}
                        />
                        <Area
                          type="monotone"
                          dataKey="yhat"
                          stroke="#16a34a"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill={`url(#colorYhat-${product_id})`}
                          animationDuration={2000}
                        />
                        <Line
                          type="monotone"
                          dataKey="yhat_upper"
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={1}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:bg-green-50/50 group-hover:border-green-100 transition-colors">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Recommended Reorder</div>
                      <div className="text-xl font-bold text-gray-800">
                        {recommendedStockIncrease > 0.1 ? `+${Math.ceil(recommendedStockIncrease)}` : 'Steady'}
                      </div>
                      <div className="text-[10px] text-green-500 font-medium mt-1">Based on upper confidence</div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Peak Demand Day</div>
                      <div className="text-xl font-bold text-gray-800">
                        {getWeekdayName(data.reduce((a, b) => a.yhat > b.yhat ? a : b).ds)}
                      </div>
                      <div className="text-[10px] text-emerald-500 font-medium mt-1">Next 30 days projection</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-[2rem]">
            <FaWarehouse size={48} className="mb-4 opacity-20" />
            <p>ไม่พบข้อมูลพยากรณ์สำหรับคลังสินค้านี้</p>
            <p className="text-sm opacity-60">โปรดตรวจสอบว่ามีประวัติการสั่งซื้อเพียงพอสำหรับการประมวลผล</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForeCast;