import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, XCircle, RefreshCw, LogOut, MessageSquare, Clock } from 'lucide-react';
import axios from 'axios';

const WhatsAppManager = () => {
  const [statusData, setStatusData] = useState({ status: 'LOADING', qr: null, qrExpiresAt: null });
  const [statsData, setStatsData] = useState({ pending: 0, sent: 0, failed: 0, isPaused: false, pausedUntil: null });
  const [error, setError] = useState(null);
  
  const [qrTimeLeft, setQrTimeLeft] = useState('');
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/whatsapp/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatusData(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch WhatsApp status. Is the backend running?');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/whatsapp/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchStats();
    const interval = setInterval(() => {
      fetchStatus();
      fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      
      if (statusData.qrExpiresAt && statusData.qrExpiresAt > now) {
        const diff = statusData.qrExpiresAt - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setQrTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      } else {
        setQrTimeLeft('');
      }

      if (statsData.pausedUntil && statsData.pausedUntil > now) {
        const diff = statsData.pausedUntil - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCooldownTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
      } else {
        setCooldownTimeLeft('');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [statusData.qrExpiresAt, statsData.pausedUntil]);

  const handleLogout = async () => {
    try {
      setStatusData({ ...statusData, status: 'LOADING' });
      await axios.post(`${baseUrl}/api/whatsapp/logout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchStatus();
    } catch (err) {
      setError('Failed to logout.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-display font-bold text-navy mb-8">WhatsApp Auto-Reply</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-grey-light p-6 flex flex-col items-center justify-center min-h-[400px]">
          {statusData.status === 'LOADING' && (
            <div className="flex flex-col items-center">
              <RefreshCw className="animate-spin text-orange mb-4" size={48} />
              <p className="text-grey-dark font-medium">Checking WhatsApp Status...</p>
            </div>
          )}

          {statusData.status === 'AUTHENTICATING' && (
            <div className="flex flex-col items-center text-center">
              <RefreshCw className="animate-spin text-orange mb-4" size={64} />
              <h2 className="text-xl font-bold text-navy mb-2">Syncing WhatsApp...</h2>
              <p className="text-grey-medium mb-4">Scan successful! Syncing chats and finalizing connection. Please wait...</p>
            </div>
          )}

          {statusData.status === 'DISCONNECTED' && (
            <div className="flex flex-col items-center text-center">
              <XCircle className="text-red-500 mb-4" size={64} />
              <h2 className="text-xl font-bold text-navy mb-2">WhatsApp Disconnected</h2>
              <p className="text-grey-medium mb-4">The client is currently disconnected. Generating a new QR code...</p>
              <RefreshCw className="animate-spin text-orange" size={24} />
            </div>
          )}

          {statusData.status === 'QR_READY' && statusData.qr && (
            <div className="flex flex-col items-center text-center">
              <QrCode className="text-navy mb-4" size={48} />
              <h2 className="text-xl font-bold text-navy mb-2">Scan QR Code</h2>
              <p className="text-grey-medium mb-4">Open WhatsApp on your phone, go to Linked Devices, and scan this code.</p>
              <div className="bg-white p-4 rounded-xl border border-grey-light shadow-sm mb-4 relative">
                <img src={statusData.qr} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
              </div>
              {qrTimeLeft && (
                <p className="text-orange font-bold flex items-center gap-2">
                  <Clock size={16} /> QR expires in {qrTimeLeft}
                </p>
              )}
            </div>
          )}

          {statusData.status === 'CONNECTED' && (
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="text-green-500 mb-4" size={64} />
              <h2 className="text-xl font-bold text-navy mb-2">WhatsApp Connected!</h2>
              <p className="text-grey-medium mb-8">Auto-replies are active and will be sent automatically based on queue limits.</p>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
              >
                <LogOut size={18} /> Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Queue Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-grey-light p-6">
          <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
            <MessageSquare className="text-orange" size={24} />
            Message Queue Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm font-bold text-blue-600 mb-1">Pending</p>
              <p className="text-3xl font-display font-bold text-navy">{statsData.pending}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-sm font-bold text-green-600 mb-1">Sent</p>
              <p className="text-3xl font-display font-bold text-navy">{statsData.sent}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <p className="text-sm font-bold text-red-600 mb-1">Failed</p>
              <p className="text-3xl font-display font-bold text-navy">{statsData.failed}</p>
            </div>
          </div>

          <div className="bg-grey-light/30 rounded-xl p-5">
            <h3 className="font-bold text-navy mb-2">Queue Status</h3>
            {statsData.isPaused ? (
              <div>
                <p className="text-orange font-medium flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-orange animate-pulse"></span>
                  Paused (Cooling down to prevent spam)
                </p>
                {cooldownTimeLeft && (
                  <p className="text-orange/80 text-sm font-bold flex items-center gap-1">
                    <Clock size={14} /> Resumes in {cooldownTimeLeft}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-green-600 font-medium flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Active and ready to send
              </p>
            )}
            <p className="text-sm text-grey-dark mt-4">
              To prevent WhatsApp bans, the system sends a maximum of 10 messages at a time, followed by a 15-minute cooldown period.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WhatsAppManager;
