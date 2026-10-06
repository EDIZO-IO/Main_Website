import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, User, Mail, Calendar, DollarSign, Search, 
  Trash2, RefreshCw, MessageSquare, ExternalLink, Clock, 
  CheckCircle2, AlertCircle, Phone, ArrowRight, X, Sparkles
} from 'lucide-react';

const ServiceRequestsView = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/admin/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch service requests:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${baseUrl}/api/admin/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedReq && selectedReq.id === id) {
          setSelectedReq(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Status update failed:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service request?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== id));
        if (selectedReq && selectedReq.id === id) setSelectedReq(null);
      }
    } catch (e) {
      console.error('Delete request error:', e);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = 
        (req.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.user_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.project_details?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.requirements?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (req.service_id?.toString() || '').includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || (req.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const counts = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => (r.status || 'pending') === 'pending').length,
    approved: requests.filter(r => r.status === 'approved' || r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected' || r.status === 'cancelled').length
  }), [requests]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Service Requests</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Service Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Review customized project specifications, budgets, and client proposals.</p>
        </div>
        <button 
          onClick={fetchRequests} 
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange' : 'text-gray-500'} /> Refresh Inquiries
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange/10 text-orange">Total</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Inquiries</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.total}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Pending</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.pending}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">In Progress</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved / Active</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.approved}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Completed</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.completed}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All', count: counts.total },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'approved', label: 'Approved', count: counts.approved },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'rejected', label: 'Rejected', count: counts.rejected }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === tab.id 
                  ? 'bg-orange text-white shadow-sm' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by client, email, details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-5">
        {filteredRequests.map(req => (
          <div 
            key={req.id} 
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-orange/30 transition-all group"
          >
            {/* Top Bar */}
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/40">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-orange/10 text-orange flex items-center justify-center font-black text-sm shrink-0">
                  {req.user_name ? req.user_name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{req.user_name || 'Anonymous Client'}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                      Service #{req.service_id || 'Custom'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1"><Mail size={12} className="text-gray-400" /> {req.user_email || 'No email provided'}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-gray-400" /> {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <select
                  value={req.status || 'pending'}
                  disabled={updatingId === req.id}
                  onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                  aria-label="Request Status"
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 outline-none cursor-pointer transition-colors ${
                    (req.status || 'pending') === 'pending' ? 'bg-amber-50 text-amber-700' :
                    req.status === 'approved' || req.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                    req.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved / In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected / Closed</option>
                </select>

                <button
                  onClick={() => handleDelete(req.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Request"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              <div className="md:col-span-8 space-y-3">
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Project Scope & Specifications</h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50/70 p-3.5 rounded-xl border border-gray-100 whitespace-pre-wrap">
                    {req.project_details || 'No project description submitted.'}
                  </p>
                </div>

                {req.requirements && (
                  <div>
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Technical Requirements</h4>
                    <p className="text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      {req.requirements}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="md:col-span-4 flex flex-col justify-between space-y-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div>
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Budget Allocation</h4>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl font-black text-sm border border-emerald-100">
                    <DollarSign size={15} /> {req.budget || 'Custom Quote'}
                  </div>
                </div>

                {/* Communication Shortcuts */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1">Direct Contact</h4>
                  <div className="flex flex-col gap-1.5">
                    {req.user_email && (
                      <a 
                        href={`mailto:${req.user_email}?subject=EDIZO: Inquiry #${req.id} Discussion`}
                        className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Mail size={13} className="text-orange" /> Email Client
                      </a>
                    )}
                    <a 
                      href={`/proposals`}
                      className="w-full py-2 px-3 bg-orange/10 hover:bg-orange/20 text-orange rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles size={13} /> Draft Proposal <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="font-bold text-sm text-gray-600">No service requests found.</p>
            <p className="text-xs text-gray-400 mt-1">Client inquiries submitted through the main site will appear here in real time.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServiceRequestsView;
