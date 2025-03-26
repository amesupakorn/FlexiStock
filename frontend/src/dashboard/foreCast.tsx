import React, { useEffect, useState } from 'react';
import { fetchForecast } from "../api/fetchForecast"
import { ForecastPoint } from '../models/forecast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { FaChartColumn } from "react-icons/fa6";

const ForeCast = () => {
  const [forecast, setForecast] = useState<Record<string, Record<string, ForecastPoint[]>>>({});
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const warehouseNames: { [key: string]: string } = {
    'W01': 'กรุงเทพ',
    'W02': 'พัทยา',
    'W03': 'เชียงใหม่',
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [forecastData, setForecastData] = useState<any[]>([]);
  
  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        const { forecastResult, forecastData } = await fetchForecast();
        setForecastData(forecastData);

        if (forecastResult && typeof forecastResult === 'object') {
          const groupedByWarehouse = Object.entries(forecastResult).reduce(
            (acc: Record<string, Record<string, ForecastPoint[]>>, [key, values]) => {
              const [warehouse_id, product_id] = key.split('-');
              if (!acc[warehouse_id]) acc[warehouse_id] = {};
              acc[warehouse_id][product_id] = values as ForecastPoint[];
              return acc;
            },
            {}
          );
  
          setForecast(groupedByWarehouse);
  
          if (Object.keys(groupedByWarehouse).length > 0) {
            setSelectedWarehouse(Object.keys(groupedByWarehouse)[0]);
          }
        } else {
          console.error("⚠️ Unexpected forecast format:", forecastResult);
        }
      } catch (err) {
        console.error("❌ Failed to load forecast:", err);
      } finally {
        setLoading(false);
      }
    };
  
    loadForecast();
  }, []);

  const getTotalSalesByWarehouse = (warehouseId: string) => {
    return forecastData
      .filter(item => item.warehouse_id === warehouseId)
      .reduce((sum, item) => sum + (item.y ?? 0), 0)
      .toFixed(2);
  };

  const getTotalSalesByProduct = (productId: string, warehouseId: string) => {
    return forecastData
      .filter(item => item.product_id === productId && item.warehouse_id === warehouseId)
      .reduce((sum, item) => sum + (item.y ?? 0), 0)
      .toFixed(2);
  };

  // Helper function to get the weekday name
  const getWeekdayName = (date: string) => {
    const day = new Date(date).getDay();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[day];
  };

  // Calculate overall stats for each warehouse
  const getWarehouseStats = (warehouseData: Record<string, ForecastPoint[]>) => {
    let totalRecommendedIncrease = 0;
    let productCount = 0;
    
    Object.values(warehouseData).forEach(data => {
      const lastForecast = data[data.length - 1];
      const recommendedStockIncrease = Math.max(0, lastForecast.yhat_upper - lastForecast.yhat);
      totalRecommendedIncrease += recommendedStockIncrease;
      productCount++;
    });
    
    return {
      totalRecommendedIncrease: totalRecommendedIncrease.toFixed(2),
      avgRecommendedIncrease: (totalRecommendedIncrease / productCount).toFixed(2),
      productCount
    };
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className='flex flex-row items-center'>
             <FaChartColumn  className='w-6 h-6'/> 
              <h1 className="text-2xl font-bold text-gray-900 mx-3">ระบบพยากรณ์สินค้าคงคลัง</h1>

            </div>
            <div className="text-sm text-gray-500">อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}</div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Warehouse Selection */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-lg font-medium text-gray-900">เลือกคลังสินค้า:</h2>
            <div className="flex flex-wrap gap-2">
            {Object.keys(forecast).map((warehouse) => (
                <button
                  key={warehouse}
                  onClick={() => setSelectedWarehouse(warehouse)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedWarehouse === warehouse
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {warehouseNames[warehouse] || warehouse} {/* ใช้ชื่อที่กำหนด หรือ ถ้าไม่มีให้แสดง warehouse ID */}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedWarehouse && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {(() => {
              const stats = getWarehouseStats(forecast[selectedWarehouse]);
              return (
                <>
                  <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">จำนวนสินค้า</h3>
                      <span className="text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.productCount}</p>
                    <p className="mt-1 text-sm text-gray-500">รายการ</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">ควรเพิ่มสต็อกรวม</h3>
                      <span className="text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalRecommendedIncrease}</p>
                    <p className="mt-1 text-sm text-gray-500">หน่วย</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">ควรเพิ่มสต็อกเฉลี่ย</h3>
                      <span className="text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.avgRecommendedIncrease}</p>
                    <p className="mt-1 text-sm text-gray-500">หน่วย/สินค้า</p>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">ยอดขายรวม</h3>
                      <span className="text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
                        </svg>
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {getTotalSalesByWarehouse(selectedWarehouse)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">หน่วย</p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Products for Selected Warehouse */}
        {selectedWarehouse && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(forecast[selectedWarehouse]).map(([product_id, data]) => {
              const lastForecast = data[data.length - 1];
              const recommendedStockIncrease = Math.max(0, lastForecast.yhat_upper - lastForecast.yhat);
              const highestForecast = data.reduce((max, item) => (item.yhat > max.yhat ? item : max), data[0]);
              const highestForecastDay = getWeekdayName(highestForecast.ds);

              const totalActualSales = parseFloat(getTotalSalesByProduct(product_id, selectedWarehouse));
              // Find trend (increasing or decreasing)
              const firstHalf = data.slice(0, Math.floor(data.length / 2));
              const secondHalf = data.slice(Math.floor(data.length / 2));
              const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.yhat, 0) / firstHalf.length;
              const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.yhat, 0) / secondHalf.length;
              const trend = secondHalfAvg > firstHalfAvg ? 'เพิ่มขึ้น' : 'ลดลง';
              const trendColor = secondHalfAvg > firstHalfAvg ? 'text-green-500' : 'text-red-500';
              const trendPercentage = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1);

              return (
                <div key={product_id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">สินค้า: {product_id}</h3>
                      <span className={`${trendColor} font-medium text-sm flex items-center`}>
                        {trend === 'เพิ่มขึ้น' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                        {trend} {trendPercentage}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    {/* Chart */}
                    <div className="mb-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis 
                            dataKey="ds" 
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip 
                            formatter={(value: number) => [value.toFixed(2), 'ปริมาณ']}
                            labelFormatter={(label) => `วันที่: ${formatDate(label)}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="yhat" 
                            name="ค่าพยากรณ์" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="yhat_upper" 
                            name="ขอบบน" 
                            stroke="#10b981" 
                            strokeDasharray="3 3" 
                            strokeWidth={1.5}
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="yhat_lower" 
                            name="ขอบล่าง" 
                            stroke="#ef4444" 
                            strokeDasharray="3 3" 
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recommendations */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* เพิ่มสต็อก */}
                    <div className="bg-blue-50 rounded-lg p-4 shadow-md">
                      <h4 className="text-sm font-medium text-blue-800">คำแนะนำการเพิ่มสต็อก</h4>
                      <p className="mt-2 text-2xl font-bold text-blue-900">
                        <span className="flex items-center">
                        {recommendedStockIncrease > 0.1 ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            <span className="font-semibold text-blue-900">
                              {recommendedStockIncrease.toFixed(2)} หน่วย
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-blue-600">
                        {recommendedStockIncrease > 0.1
                          ? "เพิ่มเพื่อรองรับการขาย"
                          : "ไม่ต้องเพิ่มสต็อก"}
                      </p>
                    </div>

                    {/* วันที่ยอดขายสูงสุด */}
                    <div className="bg-green-50 rounded-lg p-4 shadow-md">
                      <h4 className="text-sm font-medium text-green-800">วันที่ยอดขายสูงสุด</h4>
                      <p className="mt-2 text-2xl font-bold text-green-900">{highestForecastDay}</p>
                      <p className="mt-1 text-sm text-green-600">{formatDate(highestForecast.ds)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 shadow-md">
                      <h4 className="text-sm font-medium text-yellow-800">ยอดขายรวม</h4>
                      <p className="mt-2 text-2xl font-bold text-yellow-900">{totalActualSales} หน่วย</p>
                      
                    </div>
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForeCast;