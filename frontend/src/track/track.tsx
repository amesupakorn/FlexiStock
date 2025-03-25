import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, TextField, Button, Paper, CircularProgress,
  Divider, Alert, Tabs, Tab, Dialog, DialogTitle, DialogContent, 
  DialogActions, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ErrorIcon from '@mui/icons-material/Error';

// Enum matching Prisma
export type TrackingStatus = 'Processing' | 'InTransit' | 'Delivered' | 'Delayed';
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

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
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState<TrackingData | null>(null);
  const [newStatus, setNewStatus] = useState<TrackingStatus>('Processing');
  const [delayReason, setDelayReason] = useState('');
  
  // Updated sorting to prioritize delivered status and most recent timestamp
  const sortedTracking = [...trackingData].sort((a, b) => {
    // First, prioritize 'Delivered' status

    if (a.status === 'Processing' && b.status !== 'Processing') return 1;
    if (b.status === 'Processing' && a.status !== 'Processing') return -1;
    if (a.status === 'Delivered' && b.status !== 'Delivered') return -1;
    if (b.status === 'Delivered' && a.status !== 'Delivered') return 1;
  
    // Then sort by timestamp
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
  
  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError('กรุณากรอกหมายเลขคำสั่งซื้อ');
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`${BASE_URL}/${orderId}`);

      if (!response.ok) throw new Error('ไม่พบข้อมูลการติดตาม');

      const data: TrackingData[] = await response.json();
      setTrackingData(data);
      if (data.length === 0) setError('ไม่พบข้อมูลการติดตามสำหรับหมายเลขคำสั่งซื้อนี้');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      setTrackingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedTrackingItem) return;
    try {
      const response = await fetch(`${BASE_URL}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedTrackingItem.orderId,
          newStatus,
          location: locationInput || 'ไม่ระบุ',
          delayReason: newStatus === 'Delayed' ? delayReason : undefined
        })
      });

      if (!response.ok) throw new Error('ไม่สามารถเปลี่ยนสถานะได้');

      const updated = await fetch(`${BASE_URL}/${orderId}`);
      const updatedData = await updated.json();
      setTrackingData(updatedData);

      setOpenStatusDialog(false);
      setSelectedTrackingItem(null);
      setDelayReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ');
    }
  };

  const canChangeStatus = (currentStatus: TrackingStatus, newStatus: TrackingStatus) => {
    if (newStatus === 'Delayed') return true;

    const currentIndex = STATUS_PROGRESSION.indexOf(currentStatus);
    const newStatusIndex = STATUS_PROGRESSION.indexOf(newStatus);

    return newStatusIndex >= currentIndex;
  };

  const getAvailableStatuses = (currentStatus: TrackingStatus): TrackingStatus[] => {
    const currentIndex = STATUS_PROGRESSION.indexOf(currentStatus);
    const statuses: TrackingStatus[] = [];
  
    STATUS_PROGRESSION.forEach(status => {
      const index = STATUS_PROGRESSION.indexOf(status);
      if (index >= currentIndex) {
        statuses.push(status);
      }
    });
  
    if (!statuses.includes('Delayed')) {
      statuses.push('Delayed');
    }
  
    return statuses;
  };
  
  const openChangeStatusDialog = (trackingItem: TrackingData) => {
    setSelectedTrackingItem(trackingItem);
    const available = getAvailableStatuses(trackingItem.status);
    setNewStatus(available[0] || 'Delayed'); 
    setLocationInput(trackingItem.location || '');
    setDelayReason('');
    setOpenStatusDialog(true);
  };

  const getStatusColor = (status: TrackingStatus) => {
    const map = {
      Processing: 'warning.main',
      InTransit: 'info.main',
      Delivered: 'success.main',
      Delayed: 'error.main',
    };
    return map[status] || 'grey';
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

  const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd MMMM yyyy HH:mm', { locale: th });

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <LocalShippingIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>ระบบติดตามพัสดุ</Typography>
        <Typography variant="subtitle1" color="text.secondary">ตรวจสอบสถานะการจัดส่งสินค้าของคุณด้วยหมายเลขคำสั่งซื้อ</Typography>

        <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              label="หมายเลขคำสั่งซื้อ"
              variant="outlined"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              error={!!error && !loading}
              helperText={error && !loading ? error : ''}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              sx={{ minWidth: '120px', height: '56px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'ค้นหา'}
            </Button>
          </Box>
        </Paper>

        {searched && !loading && error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {searched && !loading && !error && trackingData.length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Timeline position="alternate">
              {sortedTracking.map((track, index) => {
                // Check if this is the most recent tracking item
                const isMostRecent = track.updatedAt === sortedTracking[0].updatedAt;
                
                return (
                  <TimelineItem key={track.id}>
                    <TimelineOppositeContent color="text.secondary">
                      {formatDate(track.updatedAt)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot 
                        sx={{ 
                          bgcolor: getStatusColor(track.status),
                          border: isMostRecent ? '3px solid #1976d2' : undefined,
                          transform: isMostRecent ? 'scale(1.2)' : undefined
                        }}
                      >
                        {track.status === 'Delivered' ? <CheckCircleIcon /> :
                         track.status === 'InTransit' ? <LocalShippingIcon /> :
                         track.status === 'Delayed' ? <ErrorIcon /> :
                         <HourglassBottomIcon />}
                      </TimelineDot>
                      {index < sortedTracking.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Paper 
                        elevation={isMostRecent ? 4 : 2} 
                        sx={{
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          border: isMostRecent ? '2px solid #1976d2' : undefined,
                          backgroundColor: track.status === 'Delayed' 
                            ? 'rgba(255, 0, 0, 0.08)' 
                            : undefined
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          color={track.status === 'Delayed' ? 'error' : 'inherit'}
                        >
                          {getStatusLabel(track.status)}
                        </Typography>
                        {track.location && (
                          <Typography variant="body2" color="text.secondary">
                            {track.location}
                          </Typography>
                        )}
                        {track.status === 'Delayed' && track.delayReason && (
                          <Typography variant="body2" color="error.main">
                            เหตุผลล่าช้า: {track.delayReason}
                          </Typography>
                        )}

                        {isMostRecent && track.status !== 'Delivered' && (
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => openChangeStatusDialog(track)}
                          >
                            เปลี่ยนสถานะ
                          </Button>
                        )}
                      </Paper>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </Paper>
        )}

        {/* Status Change Dialog */}
        <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
          <DialogTitle>เปลี่ยนสถานะการจัดส่ง</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>สถานะใหม่</InputLabel>
              <Select
                value={newStatus}
                label="สถานะใหม่"
                onChange={(e) => setNewStatus(e.target.value as TrackingStatus)}
              >
                {selectedTrackingItem && 
                  getAvailableStatuses(selectedTrackingItem.status).map(status => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <TextField
              label="สถานที่"
              fullWidth
              sx={{ mt: 2 }}
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            {newStatus === 'Delayed' && (
              <TextField
                label="เหตุผลล่าช้า"
                fullWidth
                sx={{ mt: 2 }}
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                multiline
                rows={2}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatusDialog(false)}>ยกเลิก</Button>
            <Button 
              onClick={() => {
                if (!canChangeStatus(selectedTrackingItem?.status || 'Processing', newStatus)) {
                  alert('ไม่สามารถเปลี่ยนไปยังสถานะที่ย้อนหลังได้');
                  return;
                }
                handleStatusChange();
              }}
              variant="contained"
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TrackingPage;