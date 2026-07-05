import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Download, FileText, Briefcase, Clock, Search, ChevronDown, Eye, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const ApplicationsView = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/admin/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-8">Loading Applications...</div>;

  return (
    <div className="p-8">
      <div className="text-sm text-gray-500 mb-2">Dashboard &rsaquo; <span className="text-orange font-medium">Applications</span></div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Applications</h1>
          <p className="text-gray-500">Manage and track all internship applications across the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-sm">
            <CheckCircle size={16} /> Bulk Approve
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'TOTAL RECEIVED', val: applications.length || '0', icon: <FileText size={20} className="text-orange"/>, bg: 'bg-orange/10', trend: '+12%' },
          { label: 'INTERVIEWING', val: applications.filter(a => a.status === 'interviewing').length || '0', icon: <Briefcase size={20} className="text-blue-500"/>, bg: 'bg-blue-100', trend: '+5%' },
          { label: 'APPROVED', val: applications.filter(a => a.status === 'approved').length || '0', icon: <CheckCircle size={20} className="text-green-500"/>, bg: 'bg-green-100', trend: '+8%' },
          { label: 'RESPONSE TIME', val: '4.2 Days', icon: <Clock size={20} className="text-gray-500"/>, bg: 'bg-gray-100', trend: 'Avg 4d' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-500'}`}>{stat.trend}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-display font-bold text-gray-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
              <Search size={16} /> All Statuses <ChevronDown size={16} className="text-gray-400"/>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
              <Briefcase size={16} /> All Roles <ChevronDown size={16} className="text-gray-400"/>
            </button>
          </div>
          <div className="text-sm text-gray-500">Showing <span className="font-bold text-gray-700">{applications.length > 0 ? '1' : '0'}-{Math.min(10, applications.length)}</span> of {applications.length} results</div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm font-bold text-gray-500 bg-white">
              <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
              <th className="p-4">Applicant Name</th>
              <th className="p-4">Internship Role</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((row, i) => (
              <tr key={row.id || i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group">
                <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${row.first_name || 'U'}+${row.last_name || 'U'}&background=random`} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-bold text-gray-900">{row.first_name} {row.last_name}</div>
                      <div className="text-xs text-gray-500">{row.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-800">{row.internship_title || row.internship_id}</div>
                  <div className="text-xs text-gray-400 font-bold tracking-wider mt-0.5">TECH INTERN PROGRAM</div>
                </td>
                <td className="p-4 text-sm text-gray-600">{new Date(row.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status === 'pending' ? 'bg-orange/10 text-orange' : row.status === 'approved' ? 'bg-green-100 text-green-700' : row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {row.status || 'Pending'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="hover:text-gray-700"><Eye size={18} /></button>
                    <button className="hover:text-gray-700"><FileText size={18} /></button>
                    <button className="hover:text-gray-700"><MoreVertical size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No applications found.</td></tr>
            )}
          </tbody>
        </table>
        
        <div className="p-4 flex items-center justify-between bg-white text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            Rows per page: 
            <select className="border border-gray-200 rounded-md p-1 bg-white"><option>10</option></select>
          </div>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400"><ChevronLeft size={16}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange text-white font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsView;
