import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, Download, FileText, Briefcase, Clock, Search, 
  ChevronDown, Eye, Globe, User, Mail, Phone, ExternalLink, 
  Trash2, Filter, X, MessageSquare, AlertCircle, RefreshCw, Check
} from 'lucide-react';

const ApplicationsView = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/admin/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`${baseUrl}/api/admin/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      console.error('Status update failed:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/admin/applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a.id !== id));
        if (selectedApp && selectedApp.id === id) setSelectedApp(null);
      }
    } catch (e) {
      console.error('Delete application error:', e);
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        (app.first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (app.last_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (app.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (app.internship_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (app.internship_id?.toString() || '').includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || (app.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const counts = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => (a.status || 'pending') === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted: applications.filter(a => a.status === 'accepted' || a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  }), [applications]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Applications</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Internship Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Review candidates, evaluate submissions, and manage applicant statuses.</p>
        </div>
        <button 
          onClick={fetchData} 
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange' : 'text-gray-500'} /> Refresh Applications
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange/10 text-orange">Total</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</p>
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
              <Briefcase size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Shortlisted</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shortlisted</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.shortlisted}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Accepted</span>
          </div>
          <div className="mt-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accepted</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{counts.accepted}</h3>
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All', count: counts.total },
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'shortlisted', label: 'Shortlisted', count: counts.shortlisted },
            { id: 'accepted', label: 'Accepted', count: counts.accepted },
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

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/60">
                <th className="p-4">Applicant</th>
                <th className="p-4">Internship Track</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Resume</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredApps.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  
                  {/* Applicant Info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange/10 text-orange flex items-center justify-center font-bold text-xs shrink-0">
                        {row.first_name ? row.first_name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {row.first_name} {row.last_name || ''}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">{row.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4 font-semibold text-gray-800">
                    {row.internship_title || `Internship #${row.internship_id || 'General'}`}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">
                    <div>{new Date(row.created_at).toLocaleDateString()}</div>
                    {row.ip_address && (
                      <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1 mt-0.5">
                        <Globe size={10} /> {row.ip_address}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={row.status || 'pending'}
                      disabled={updatingId === row.id}
                      onChange={(e) => handleStatusUpdate(row.id, e.target.value)}
                      aria-label="Application Status"
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border-0 outline-none cursor-pointer transition-colors ${
                        (row.status || 'pending') === 'pending' ? 'bg-amber-50 text-amber-700' :
                        row.status === 'accepted' || row.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        row.status === 'shortlisted' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>

                  {/* Resume Link */}
                  <td className="p-4">
                    {row.resume_url || row.resume ? (
                      <a 
                        href={row.resume_url || row.resume} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-xs font-bold text-orange hover:underline bg-orange/5 px-2.5 py-1 rounded-lg border border-orange/20"
                      >
                        <FileText size={12} /> View CV
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">None</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedApp(row)}
                        className="p-1.5 hover:bg-orange/10 text-gray-500 hover:text-orange rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <AlertCircle size={28} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold">No applications matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Details Drawer Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-gray-900">Applicant Dossier</h3>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Candidate Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center font-black text-xl">
                  {selectedApp.first_name ? selectedApp.first_name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">{selectedApp.first_name} {selectedApp.last_name || ''}</h4>
                  <p className="text-xs text-gray-500">{selectedApp.internship_title || 'Internship Applicant'}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    (selectedApp.status || 'pending') === 'pending' ? 'bg-amber-50 text-amber-700' :
                    selectedApp.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                    selectedApp.status === 'shortlisted' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {selectedApp.status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={14} className="text-gray-400" />
                  <a href={`mailto:${selectedApp.email}`} className="font-semibold text-orange hover:underline">{selectedApp.email}</a>
                </div>
                {selectedApp.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={14} className="text-gray-400" />
                    <span className="font-semibold">{selectedApp.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500 text-[11px] pt-1 border-t border-gray-200/60">
                  <Clock size={12} /> Applied: {new Date(selectedApp.created_at).toLocaleString()}
                </div>
              </div>

              {/* Statement / Cover Letter */}
              {selectedApp.cover_letter && (
                <div>
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Statement / Letter</h5>
                  <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-700 leading-relaxed max-h-44 overflow-y-auto">
                    {selectedApp.cover_letter}
                  </div>
                </div>
              )}

              {/* Resume File */}
              <div>
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Resume / Curriculum Vitae</h5>
                {selectedApp.resume_url || selectedApp.resume ? (
                  <a 
                    href={selectedApp.resume_url || selectedApp.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-orange/5 hover:bg-orange/10 border border-orange/20 rounded-xl text-xs font-bold text-orange flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText size={16} /> Open Candidate CV <ExternalLink size={14} />
                  </a>
                ) : (
                  <p className="text-xs text-gray-400 italic">No resume file attached.</p>
                )}
              </div>
            </div>

            {/* Quick Status Action Buttons */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Change Status</h5>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedApp.id, 'shortlisted')}
                  className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                  className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                  className="py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationsView;
