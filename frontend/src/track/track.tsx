import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, CircularProgress, Divider } from '@mui/material';
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

interface TrackingData {
  id: string;
  orderId: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

const TrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string>('');
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError('กรุณากรอกหมายเลขคำสั่งซื้อ');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/track/${orderId}`);
      
      if (!response.ok) {
        throw new Error('ไม่พบข้อมูลการติดตาม');
      }
      
      const data = await response.json();
      setTrackingData(data);
      
      if (data.length === 0) {
        setError('ไม่พบข้อมูลการติดตามสำหรับหมายเลขคำสั่งซื้อนี้');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      setTrackingData([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'warning.main';
      case 'shipped':
        return 'info.main';
      case 'out for delivery':
        return 'secondary.main';
      case 'delivered':
        return 'success.main';
      case 'delayed':
        return 'error.main';
      default:
        return 'grey.500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy HH:mm', { locale: th });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <LocalShippingIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          ระบบติดตามพัสดุ
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          ตรวจสอบสถานะการจัดส่งสินค้าของคุณด้วยหมายเลขคำสั่งซื้อ
        </Typography>

        <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

        {searched && !loading && !error && trackingData.length > 0 && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                ผลการติดตามหมายเลขคำสั่งซื้อ: {orderId}
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Box>

            <Timeline position="alternate">
              {trackingData.map((track, index) => (
                <TimelineItem key={track.id}>
                  <TimelineOppositeContent color="text.secondary">
                    {formatDate(track.updatedAt)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: getStatusColor(track.status) }} />
                    {index < trackingData.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" component="span">
                        {track.status}
                      </Typography>
                      <Typography>{track.location}</Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TrackingPage;