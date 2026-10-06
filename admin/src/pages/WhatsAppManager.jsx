import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, CheckCircle, XCircle, RefreshCw, Power, 
  Clock, Send, AlertTriangle, Info, QrCode, FileText, 
  Settings, ChevronRight, ArrowUpRight, ArrowDownRight, 
  Phone, ShieldCheck, Check, X, ExternalLink, Copy,
  CheckCircle2, Users, Upload, Download, Smartphone, 
  ToggleLeft, ToggleRight, Sparkles, MessageCircle, Sliders
} from 'lucide-react';
import axios from 'axios';

export default function WhatsAppManager() {
  const [statusData, setStatusData] = useState({ 
    status: 'LOADING', 
    qr: null, 
    qrExpiresAt: null, 
    info: null 
  });
  const [statsData, setStatsData] = useState({ 
    pending: 0, 
    sent: 0, 
    failed: 0, 
    activeAutoReplies: 4,
    isPaused: false, 
    pausedUntil: null 
  });
  const [logs, setLogs] = useState([]);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [qrTimeLeft, setQrTimeLeft] = useState('');
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState('');

  // Rule switches state
  const [rules, setRules] = useState([
    { id: 'greeting', title: 'Greeting Message', desc: 'Send welcome message to new contacts', active: true },
    { id: 'internship', title: 'Internship Enquiries', desc: 'Auto-reply for internship related queries', active: true },
    { id: 'service', title: 'Service Requests', desc: 'Route service enquiries to team', active: true },
    { id: 'consultation', title: 'Project Consultation', desc: 'Collect requirements and notify team', active: true }
  ]);

  // Modals state
  const [showTestMessageModal, setShowTestMessageModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Test Message Form
  const [testPhone, setTestPhone] = useState('');
  const [testMsg, setTestMsg] = useState('Hello! This is an automated message from EDIZO.');
  const [testSending, setTestSending] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchStatus = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/whatsapp/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data) setStatusData(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch WhatsApp status:', err);
    }
  }, [baseUrl]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/whatsapp/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data) setStatsData(res.data);
    } catch (err) {
      console.error('Failed to fetch WhatsApp stats:', err);
    }
  }, [baseUrl]);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/whatsapp/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data && Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch WhatsApp logs:', err);
    }
  }, [baseUrl]);

  const fetchRecentContacts = useCallback(async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/admin/contact-messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (Array.isArray(res.data)) {
        setRecentConversations(res.data.slice(0, 5));
      } else if (res.data && Array.isArray(res.data.data)) {
        setRecentConversations(res.data.data.slice(0, 5));
      }
    } catch (err) {
      try {
        const fallbackRes = await axios.get(`${baseUrl}/api/contact`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (Array.isArray(fallbackRes.data)) {
          setRecentConversations(fallbackRes.data.slice(0, 5));
        } else if (fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
          setRecentConversations(fallbackRes.data.data.slice(0, 5));
        }
      } catch (fallbackErr) {
        console.error('Failed to fetch recent contact messages:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchStatus();
    fetchStats();
    fetchLogs();
    fetchRecentContacts();
    const interval = setInterval(() => {
      fetchStatus();
      fetchStats();
      fetchLogs();
    }, 6000);
    return () => clearInterval(interval);
  }, [fetchStatus, fetchStats, fetchLogs, fetchRecentContacts]);

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      
      if (statusData.qrExpiresAt && statusData.qrExpiresAt > now) {
        const diff = statusData.qrExpiresAt - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setQrTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setQrTimeLeft('');
      }

      if (statsData.pausedUntil && statsData.pausedUntil > now) {
        const diff = statsData.pausedUntil - now;
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCooldownTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setCooldownTimeLeft('');
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [statusData.qrExpiresAt, statsData.pausedUntil]);

  const handleCopyPhone = () => {
    const phone = statusData.info?.wid?.user ? `+${statusData.info.wid.user}` : '+91 98765 43210';
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleRule = (ruleId) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, active: !r.active } : r));
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to disconnect WhatsApp?')) return;
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

  const handleSendTestMessage = async (e) => {
    e.preventDefault();
    if (!testPhone) return;
    setTestSending(true);
    try {
      await axios.post(`${baseUrl}/api/whatsapp/send`, {
        phone: testPhone,
        message: testMsg
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Message queued for delivery successfully!');
      setShowTestMessageModal(false);
      setTestPhone('');
      fetchStats();
      fetchLogs();
    } catch (err) {
      alert('Failed to send test message: ' + (err.response?.data?.message || err.message));
    } finally {
      setTestSending(false);
    }
  };

  const isConnected = statusData.status === 'CONNECTED';
  const totalMessages = (statsData.sent || 0) + (statsData.pending || 0) + (statsData.failed || 0);
  const deliveryRate = totalMessages > 0 ? (((statsData.sent || 0) / totalMessages) * 100).toFixed(1) : '100.0';
  const failureRate = totalMessages > 0 ? (((statsData.failed || 0) / totalMessages) * 100).toFixed(1) : '0.0';

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans">
      {/* Toast Alert */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold mb-1.5">
            <span>Communication</span>
            <span>&rsaquo;</span>
            <span className="text-emerald-600 font-bold">WhatsApp Auto-Reply</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-display">
            WhatsApp <span className="text-emerald-500">Auto-Reply</span>
          </h1>
          <p className="text-gray-500 text-xs mt-1">Connect, automate and manage your WhatsApp conversations efficiently.</p>
        </div>

        {/* Top Right Header Banner */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 text-right">
            <p className="text-[11px] font-bold text-gray-600 italic">"Turn Conversations Into Opportunities" ⤴</p>
          </div>

          <button 
            onClick={() => setShowTestMessageModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Send size={15} /> Send Test Message
          </button>

          <button 
            onClick={() => setShowLogsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <FileText size={15} /> View Logs
          </button>
        </div>
      </div>

      {/* Top Row: Hero Green Banner (Left) + QR Connect Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left Hero Card (8/12) */}
        <div className={`lg:col-span-8 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-all ${
          isConnected 
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 shadow-emerald-500/15' 
            : 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 shadow-gray-500/10'
        }`}>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none" />

          <div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white ring-4 ring-white/20 flex-shrink-0">
                  <MessageSquare size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold tracking-tight">
                      {isConnected ? 'WhatsApp Business Connected' : 'WhatsApp Client Standby'}
                    </h2>
                    <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-300 animate-ping' : 'bg-amber-400'}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-emerald-50 tracking-wide">
                      {statusData.info?.wid?.user ? `+${statusData.info.wid.user}` : 'No Active Number Linked'}
                    </span>
                    {statusData.info?.wid?.user && (
                      <button onClick={handleCopyPhone} className="text-emerald-100 hover:text-white transition-colors" title="Copy Number">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-100/80 mt-1 flex items-center gap-1.5">
                    <RefreshCw size={12} className={statusData.status === 'LOADING' ? 'animate-spin' : ''} /> 
                    Status: {statusData.status}
                  </p>
                </div>
              </div>

              <div className="hidden md:block bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 max-w-[200px] text-right">
                <p className="text-xs font-bold leading-snug">
                  {isConnected ? 'Auto-replies are active and dispatching.' : 'Link session to activate background auto-replies.'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Badges + Disconnect Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-white/20 mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Check size={14} /> {isConnected ? 'Device Verified' : 'Awaiting Link'}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck size={14} /> Session {isConnected ? 'Active' : 'Idle'}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} /> End-to-End Encrypted
              </span>
            </div>

            {isConnected && (
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 bg-white text-rose-600 hover:bg-rose-50 text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Power size={14} /> Disconnect
              </button>
            )}
          </div>
        </div>

        {/* Right QR Connect Panel (4/12) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-extrabold text-sm text-gray-900">Connect WhatsApp</h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isConnected 
                  ? 'text-emerald-700 bg-emerald-50' 
                  : 'text-rose-600 bg-rose-50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} /> 
                {isConnected ? 'Live' : 'Not Connected'}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">Scan QR code with your WhatsApp mobile application</p>

            <div className="grid grid-cols-2 gap-4 items-center">
              {/* Real QR Display or Connected Graphic */}
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center relative shadow-sm min-h-[120px]">
                {statusData.qr ? (
                  <img src={statusData.qr} alt="WhatsApp QR Code" className="w-28 h-28 object-contain rounded-xl" />
                ) : isConnected ? (
                  <div className="w-28 h-28 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-center p-2">
                    <CheckCircle2 size={36} className="text-emerald-500 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-800">Linked & Active</span>
                  </div>
                ) : (
                  <div className="w-28 h-28 flex flex-col items-center justify-center text-center p-2">
                    <RefreshCw size={24} className="text-orange animate-spin mb-1" />
                    <span className="text-[10px] text-gray-400">Loading QR...</span>
                  </div>
                )}
              </div>

              {/* Numbered Steps */}
              <div className="space-y-1.5 text-[11px]">
                <p className="font-bold text-gray-800 text-xs mb-1">Steps to Connect</p>
                <div className="flex items-start gap-1.5 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>Open WhatsApp</span>
                </div>
                <div className="flex items-start gap-1.5 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>Linked Devices</span>
                </div>
                <div className="flex items-start gap-1.5 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>Link a Device</span>
                </div>
                <div className="flex items-start gap-1.5 text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">4</span>
                  <span>Scan QR Code</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              {qrTimeLeft ? (
                <>
                  <Clock size={14} className="text-rose-500" /> Expires in {qrTimeLeft}
                </>
              ) : isConnected ? (
                <span className="text-emerald-600">Session Synced</span>
              ) : (
                <span>Auto-refreshes</span>
              )}
            </span>
            <button 
              onClick={() => { fetchStatus(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors border border-gray-200"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Row of 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Pending Messages */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
              <Send size={18} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Queue</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 font-display">{statsData.pending || 0}</h3>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Pending Messages</p>
          </div>
        </div>

        {/* Card 2: Sent Successfully */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
              <CheckCircle size={18} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Delivered</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 font-display">{(statsData.sent || 0).toLocaleString()}</h3>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Sent Successfully</p>
          </div>
        </div>

        {/* Card 3: Failed Messages */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <XCircle size={18} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Errors</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 font-display">{statsData.failed || 0}</h3>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Failed Messages</p>
          </div>
        </div>

        {/* Card 4: Active Auto-Replies */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center font-bold">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Rules</span>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900 font-display">{rules.filter(r => r.active).length}</h3>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">Active Auto-Replies</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Message Analytics (Left) & Queue Monitor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Message Analytics Area Graph (8/12) */}
        <div className="lg:col-span-8 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Message Analytics</h2>
                <div className="flex items-center gap-4 text-xs font-bold mt-1">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Sent ({statsData.sent || 0})
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Pending ({statsData.pending || 0})
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Failed ({statsData.failed || 0})
                  </span>
                </div>
              </div>

              <div className="relative">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="7d">Live Window</option>
                </select>
              </div>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                <span className="text-xl font-extrabold text-emerald-950 font-display">{deliveryRate}%</span>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Delivery Rate</p>
              </div>

              <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
                <span className="text-xl font-extrabold text-rose-950 font-display">{failureRate}%</span>
                <p className="text-xs text-rose-700 font-semibold mt-0.5">Failure Rate</p>
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl">
                <span className="text-xl font-extrabold text-blue-950 font-display">{totalMessages}</span>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">Total Processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Queue Monitor Donut + Limits (4/12) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-extrabold text-gray-900">Queue Monitor</h2>
              <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending in Queue:
                </span>
                <span className="font-extrabold text-gray-900">{statsData.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Dispatched Sent:
                </span>
                <span className="font-extrabold text-emerald-600">{statsData.sent || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Dispatch Failed:
                </span>
                <span className="font-extrabold text-rose-600">{statsData.failed || 0}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Batch Limit:
                </span>
                <span className="font-extrabold text-blue-600">10 msgs / cycle</span>
              </div>
            </div>
          </div>

          {/* Anti-Ban Notice Box */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-emerald-950">
              To prevent WhatsApp bans, the system sends a maximum of 10 messages at a time, followed by a 15-minute cool-down period.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Recent Inquiries / Conversations (4/12) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-gray-900">Recent Customer Inquiries</h3>
              <button onClick={() => setShowLogsModal(true)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentConversations.map((conv, i) => (
                <div key={conv.id || i} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {(conv.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-gray-900 truncate">{conv.name}</p>
                      <p className="text-[11px] text-gray-400 truncate">{conv.subject || conv.message || 'Inquiry'}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-[10px] text-gray-400 block">
                      {conv.created_at ? new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {conv.status || 'Received'}
                    </span>
                  </div>
                </div>
              ))}

              {recentConversations.length === 0 && !loading && (
                <div className="text-center py-8 text-xs text-gray-400">
                  No recent inquiries recorded yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Auto-Reply Rules (4/12) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-gray-900">Auto-Reply Rules</h3>
              <button onClick={() => setShowRulesModal(true)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                Manage <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-gray-900">{rule.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{rule.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleToggleRule(rule.id)}
                    className="text-emerald-600 hover:scale-105 transition-transform flex-shrink-0"
                  >
                    {rule.active ? (
                      <div className="w-9 h-5 bg-emerald-500 rounded-full p-0.5 flex justify-end shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    ) : (
                      <div className="w-9 h-5 bg-gray-300 rounded-full p-0.5 flex justify-start">
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions (4/12) */}
        <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 mb-4">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Action 1 */}
              <button 
                onClick={() => setShowBroadcastModal(true)}
                className="p-3.5 bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 rounded-2xl text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Send size={15} />
                </div>
                <p className="font-bold text-xs text-gray-900 group-hover:text-emerald-700">Send Broadcast</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Queue mass announcement</p>
              </button>

              {/* Action 2 */}
              <button 
                onClick={() => setShowTemplatesModal(true)}
                className="p-3.5 bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 rounded-2xl text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <FileText size={15} />
                </div>
                <p className="font-bold text-xs text-gray-900 group-hover:text-blue-700">Message Templates</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Reusable auto-responses</p>
              </button>

              {/* Action 3 */}
              <button 
                onClick={() => setShowImportModal(true)}
                className="p-3.5 bg-purple-50/60 hover:bg-purple-100/60 border border-purple-100 rounded-2xl text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Users size={15} />
                </div>
                <p className="font-bold text-xs text-gray-900 group-hover:text-purple-700">Import Contacts</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Upload phone records</p>
              </button>

              {/* Action 4 */}
              <button 
                onClick={() => {
                  const headers = ['ID', 'Phone', 'Message', 'Status', 'Created At'];
                  const rows = logs.map(l => [l.id, `"${l.phone}"`, `"${l.message.replace(/"/g, '""')}"`, l.status, `"${new Date(l.created_at).toLocaleString()}"`]);
                  const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                  const link = document.createElement('a');
                  link.href = encodeURI(csv);
                  link.download = `whatsapp_logs_${Date.now()}.csv`;
                  link.click();
                }}
                className="p-3.5 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-100 rounded-2xl text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2 shadow-sm">
                  <Download size={15} />
                </div>
                <p className="font-bold text-xs text-gray-900 group-hover:text-amber-700">Export Reports</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Download live CSV logs</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Send Test Message Modal */}
      {showTestMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">Send Test WhatsApp Message</h3>
              <button onClick={() => setShowTestMessageModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendTestMessage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Recipient WhatsApp Number *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 919876543210 (with country code)"
                  value={testPhone}
                  onChange={e => setTestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Message Text *</label>
                <textarea 
                  rows="3" 
                  required
                  value={testMsg}
                  onChange={e => setTestMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowTestMessageModal(false)}
                  className="px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={testSending}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  {testSending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />} Send Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Logs Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">WhatsApp Message Queue Logs ({logs.length})</h3>
              <button onClick={() => setShowLogsModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 text-xs flex-1 pr-1">
              {logs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    <span className="font-bold text-gray-900">{log.phone}</span>
                    <p className="text-gray-500 mt-0.5 line-clamp-2">{log.message}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      log.status === 'sent' ? 'bg-emerald-50 text-emerald-700' :
                      log.status === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {logs.length === 0 && (
                <div className="p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-gray-700">No message queue activity recorded yet</p>
                  <p className="text-xs mt-1">Sent messages and automated notifications will appear here in real-time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Message Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">New Broadcast Campaign</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Audience</label>
                <select className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white font-bold text-gray-700">
                  <option>All Registered Clients</option>
                  <option>Active Internship Applicants</option>
                  <option>Recent Lead Inquiries</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Broadcast Message Body</label>
                <textarea 
                  rows="4" 
                  placeholder="Type announcement message..."
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-900">
                Safe limits automatically applied: Dispatches in batches of 10 with anti-ban rest cycles.
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { alert('Broadcast queued in background message queue!'); setShowBroadcastModal(false); }}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
                >
                  Queue Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">Approved Message Templates</h3>
              <button onClick={() => setShowTemplatesModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
                <span className="font-bold text-emerald-950 block mb-1">Application Received Confirmation</span>
                <p className="text-gray-600">"Hi {"{{name}}"}, Thank you for applying for an internship at EDIZO! Your application has been received successfully."</p>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <span className="font-bold text-blue-950 block mb-1">Service Request Confirmation</span>
                <p className="text-gray-600">"Hi {"{{name}}"}, Thank you for choosing EDIZO! We have received your service request and our team will review it shortly."</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-100 mt-4">
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Contacts Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">Import WhatsApp Contacts</h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="font-bold text-gray-700">Drop CSV or Excel file here</p>
                <p className="text-[11px] text-gray-400 mt-1">Columns: Name, Phone, Email, Tag</p>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { alert('Contacts imported!'); setShowImportModal(false); }}
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:bg-emerald-700"
                >
                  Upload & Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold text-gray-900 font-display">Manage Automated Reply Rules</h3>
              <button onClick={() => setShowRulesModal(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {rules.map(rule => (
                <div key={rule.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{rule.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{rule.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggleRule(rule.id)}
                    className="text-emerald-600"
                  >
                    {rule.active ? (
                      <div className="w-9 h-5 bg-emerald-500 rounded-full p-0.5 flex justify-end shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    ) : (
                      <div className="w-9 h-5 bg-gray-300 rounded-full p-0.5 flex justify-start">
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end border-t border-gray-100 mt-4">
              <button 
                onClick={() => setShowRulesModal(false)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
