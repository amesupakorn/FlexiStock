import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { handleAlert } from '../components/swifAlert';

// Enum matching Prisma
export type TrackingStatus = 'Processing' | 'InTransit' | 'Delivered' | 'Delayed';
const BASE_URL = "http://localhost:5001/api/track";

// Define status progression order
const STATUS_PROGRESSION: TrackingStatus[] = ['Processing', 'InTransit', 'Delivered'];

interface TrackingData {
  id: string;
  orderId: string;
  status: TrackingStatus;
  location?: string;
  updatedAt: string;
  delayReason?: string;
}

const TrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Status Update Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState<TrackingData | null>(null);
  const [newStatus, setNewStatus] = useState<TrackingStatus>('Processing');
  const [locationInput, setLocationInput] = useState('');
  const [delayReason, setDelayReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSearch = async (id?: string) => {
    const searchId = id || orderId;
    if (!searchId.trim()) {
      handleAlert({ title: "กรุณากรอกหมายเลขคำสั่งซื้อ", icon: "warning" });
      return;
    }
    
    setLoading(true);
    setSearched(true);

    try {
      // Encode ID and ensure it's trimmed
      const cleanId = searchId.trim();
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(cleanId)}`);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error('ไม่พบหมายเลขคำสั่งซื้อนี้');
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }

      const data: TrackingData[] = await response.json();
      setTrackingData(data);
      
      if (data.length === 0) {
        handleAlert({ 
          title: "ไม่พบข้อมูลการติดตาม", 
          text: "หมายเลขคำสั่งซื้อนี้อาจยังไม่ได้เริ่มการจัดส่ง หรือหมายเลขไม่ถูกต้อง", 
          icon: "info" 
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      const message = err instanceof Error ? err.message : "ไม่สามารถดึงข้อมูลการติดตามได้";
      handleAlert({ title: "เกิดข้อผิดพลาด", text: message, icon: "error" });
      setTrackingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('orderId');
    if (idFromUrl) {
      setOrderId(idFromUrl);
      handleSearch(idFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleStatusChange = async () => {
    if (!selectedTrackingItem) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`${BASE_URL}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedTrackingItem.orderId,
          newStatus,
          location: locationInput || 'Logistics Hub',
          delayReason: newStatus === 'Delayed' ? delayReason : undefined
        })
      });

      if (!response.ok) throw new Error('ไม่สามารถเปลี่ยนสถานะได้');

      handleAlert({ title: "อัปเดตสถานะสำเร็จ", icon: "success" });
      
      // Refresh data
      const updated = await fetch(`${BASE_URL}/${selectedTrackingItem.orderId}`);
      const updatedData = await updated.json();
      setTrackingData(updatedData);

      setIsUpdateModalOpen(false);
      setSelectedTrackingItem(null);
      setDelayReason('');
    } catch (err) {
      console.error("Update error:", err);
      handleAlert({ title: "เกิดข้อผิดพลาด", text: "ไม่สามารถอัปเดตสถานะได้", icon: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: TrackingStatus) => {
    const map = {
      Processing: 'กำลังเตรียมสินค้า',
      InTransit: 'ระหว่างการขนส่ง',
      Delivered: 'จัดส่งสำเร็จ',
      Delayed: 'การจัดส่งล่าช้า',
    };
    return map[status];
  };

  const getStatusColor = (status: TrackingStatus) => {
    const map = {
      Processing: 'text-amber-600 bg-amber-50 border-amber-100',
      InTransit: 'text-blue-600 bg-blue-50 border-blue-100',
      Delivered: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      Delayed: 'text-rose-600 bg-rose-50 border-rose-100',
    };
    return map[status] || 'text-slate-600 bg-slate-50 border-slate-100';
  };

  const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: th });

  const sortedTracking = [...trackingData].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Search */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-6 text-white transform hover:rotate-12 transition-transform cursor-pointer" onClick={() => navigate('/track-list')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ระบบติดตามพัสดุ</h1>
          <p className="text-slate-500 font-medium">ตรวจสอบสถานะการจัดส่งสินค้าด้วยหมายเลขคำสั่งซื้อ (Order ID)</p>
          
          <div className="mt-8 flex max-w-lg mx-auto gap-3">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors">#</span>
              </div>
              <input
                type="text"
                placeholder="กรอกหมายเลขคำสั่งซื้อ..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-8 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  ค้นหา
                </>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Results */}
        {searched && trackingData.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
              
              <div className="flex flex-col gap-10 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                {sortedTracking.map((track, index) => {
                  const isLatest = index === 0;
                  return (
                    <div key={track.id} className="flex gap-8 relative">
                      {/* Timeline Dot */}
                      <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-4 border-white ${
                        track.status === 'Delivered' ? 'bg-emerald-500 text-white' :
                        track.status === 'Delayed' ? 'bg-rose-500 text-white' :
                        track.status === 'InTransit' ? 'bg-blue-500 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {track.status === 'Delivered' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {track.status === 'InTransit' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V9a1 1 0 00-1-1h-5z" />
                          </svg>
                        )}
                        {track.status === 'Delayed' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                        {track.status === 'Processing' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-lg font-bold ${isLatest ? 'text-slate-900' : 'text-slate-500'}`}>
                              {getStatusLabel(track.status)}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(track.status)}`}>
                              {track.status}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-slate-400">{formatDate(track.updatedAt)}</p>
                          {track.location && (
                            <p className="text-sm text-slate-600 mt-2 flex items-center gap-1.5 font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {track.location}
                            </p>
                          )}
                          {track.status === 'Delayed' && track.delayReason && (
                            <div className="mt-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                              <p className="text-sm text-rose-700 font-medium">
                                <span className="font-bold">เหตุผลล่าช้า:</span> {track.delayReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {isLatest && track.status !== 'Delivered' && (
                          <button
                            onClick={() => {
                              setSelectedTrackingItem(track);
                              setNewStatus(track.status);
                              setLocationInput(track.location || '');
                              setIsUpdateModalOpen(true);
                            }}
                            className="sm:self-center px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2 shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            อัปเดตสถานะ
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button onClick={() => navigate('/track-list')} className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                กลับไปหน้าจัดการคำสั่งซื้อ
              </button>
            </div>
          </div>
        )}

        {/* Empty States */}
        {searched && !loading && trackingData.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">ไม่พบข้อมูลการติดตาม</h3>
            <p className="text-slate-500 font-medium">กรุณาตรวจสอบหมายเลขคำสั่งซื้อและลองใหม่อีกครั้ง</p>
          </div>
        )}

        {/* Update Modal */}
        {isUpdateModalOpen && selectedTrackingItem && (
          <div className="fixed inset-0 backdrop-blur-md bg-slate-900/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-blue-600 text-white px-8 py-6 flex items-center justify-between">
                <h2 className="text-xl font-black flex items-center gap-3 tracking-tight">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  อัปเดตสถานะจัดส่ง
                </h2>
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Order ID</label>
                  <p className="text-lg font-bold text-slate-800">#{selectedTrackingItem.orderId.slice(0, 12)}</p>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-3">สถานะใหม่</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TrackingStatus)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800"
                  >
                    <option value="Processing">กำลังเตรียมสินค้า</option>
                    <option value="InTransit">ระหว่างการขนส่ง</option>
                    <option value="Delivered">จัดส่งสำเร็จ</option>
                    <option value="Delayed">การจัดส่งล่าช้า</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-bold mb-3">ตำแหน่งปัจจุบัน</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="ระบุสถานที่..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  />
                </div>

                {newStatus === 'Delayed' && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-slate-700 text-sm font-bold mb-3">เหตุผลที่ล่าช้า</label>
                    <textarea
                      value={delayReason}
                      onChange={(e) => setDelayReason(e.target.value)}
                      placeholder="อธิบายสาเหตุความล่าช้า..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-800 h-28 resize-none placeholder:text-slate-300"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="flex-grow py-3 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleStatusChange}
                    disabled={isUpdating}
                    className="flex-grow py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "ยืนยันการเปลี่ยน"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default TrackingPage;