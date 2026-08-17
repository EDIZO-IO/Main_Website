import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Download, FileText, Briefcase, Clock, Search, ChevronDown, Eye, Globe } from 'lucide-react';

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
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: 'TOTAL RECEIVED', val: applications.length || '0', icon: <FileText size={20} className="text-orange"/>, bg: 'bg-orange/10', trend: '+12%' },
          { label: 'SHORTLISTED', val: applications.filter(a => a.status === 'shortlisted').length || '0', icon: <Briefcase size={20} className="text-blue-500"/>, bg: 'bg-blue-100', trend: '+5%' },
          { label: 'ACCEPTED', val: applications.filter(a => a.status === 'accepted' || a.status === 'approved').length || '0', icon: <CheckCircle size={20} className="text-green-500"/>, bg: 'bg-green-100', trend: '+8%' },
          { label: 'PENDING REVIEW', val: applications.filter(a => a.status === 'pending').length || '0', icon: <Clock size={20} className="text-gray-500"/>, bg: 'bg-gray-100', trend: 'Intake' }
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm font-bold text-gray-500 bg-gray-50">
              <th className="p-4">Applicant Name</th>
              <th className="p-4">Internship Role</th>
              <th className="p-4">Applied Date & IP</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Resume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((row, i) => (
              <tr key={row.id || i} className="hover:bg-gray-50/50 transition-colors">
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
                </td>
                <td className="p-4">
                  <div className="text-sm text-gray-600">{new Date(row.created_at).toLocaleDateString()}</div>
                  {row.ip_address && (
                    <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1 mt-0.5" title={`User Agent: ${row.user_agent || 'Unknown'}`}>
                      <Globe size={11} /> {row.ip_address}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${row.status === 'pending' ? 'bg-orange/10 text-orange' : row.status === 'accepted' || row.status === 'approved' ? 'bg-green-100 text-green-700' : row.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {row.status || 'Pending'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {row.resume_url || row.resume ? (
                    <a href={row.resume_url || row.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-orange hover:underline bg-orange/10 px-3 py-1.5 rounded-lg">
                      <FileText size={14} /> View Resume
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">No File</span>
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No applications found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsView;
