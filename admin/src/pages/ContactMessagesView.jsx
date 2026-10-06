import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Calendar, Shield, Globe, Search, Trash2, 
  CheckCircle, MessageSquare, Send, RefreshCw, AlertCircle, X, ExternalLink
} from 'lucide-react';

const ContactMessagesView = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMsg, setSelectedMsg] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/admin/contact-messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch contact messages:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      const res = await fetch(`${baseUrl}/api/admin/contact-messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
      }
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesSearch = 
        (m.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.message?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (m.status || 'unread') === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const unreadCount = messages.filter(m => (m.status || 'unread') === 'unread').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Messages</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Contact Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Direct inquiries from the website with IP fraud protection metadata.</p>
        </div>
        <button 
          onClick={fetchMessages} 
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange' : 'text-gray-500'} /> Refresh Messages
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Inquiries ({messages.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'unread' ? 'bg-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setStatusFilter('read')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'read' ? 'bg-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
        {filteredMessages.map(msg => (
          <div 
            key={msg.id} 
            className={`p-6 transition-all hover:bg-gray-50/70 ${
              (msg.status || 'unread') === 'unread' ? 'bg-orange/5' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  (msg.status || 'unread') === 'unread' ? 'bg-orange text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                }`}>
                  {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{msg.name}</h3>
                    {(msg.status || 'unread') === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-orange"></span>
                    )}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:text-orange transition-colors flex items-center gap-1 mt-0.5">
                    <Mail size={12} /> {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-gray-400 flex items-center gap-1 mr-2">
                  <Calendar size={12} /> {new Date(msg.created_at).toLocaleDateString()}
                </span>
                {msg.ip_address && (
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-mono flex items-center gap-1" title={`User Agent: ${msg.user_agent || 'Unknown'}`}>
                    <Globe size={10} className="text-gray-400" /> {msg.ip_address}
                  </span>
                )}
                <button
                  onClick={() => toggleStatus(msg.id, msg.status || 'unread')}
                  className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  {(msg.status || 'unread') === 'unread' ? 'Mark Read' : 'Mark Unread'}
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 mt-2 text-xs">
              <p className="font-bold text-gray-900 mb-1">Subject: {msg.subject || 'General Inquiry'}</p>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 flex items-center gap-2">
              <a 
                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Inquiry')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange/10 hover:bg-orange/20 text-orange rounded-lg text-xs font-bold transition-colors"
              >
                <Send size={12} /> Reply via Email
              </a>
              <a 
                href={`/whatsapp`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors"
              >
                <MessageSquare size={12} /> WhatsApp Lead
              </a>
            </div>

          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="font-bold text-sm text-gray-600">No contact inquiries found.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ContactMessagesView;
