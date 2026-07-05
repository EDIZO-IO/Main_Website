import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, User, Mail, Calendar, Link as LinkIcon } from 'lucide-react';

const InternshipApplicationsView = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/admin/applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  if (loading) return <div className="p-8">Loading Applications...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Internship Applications</h1>
        <p className="text-gray-500">Review student applications for internships.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700 text-sm">Applicant</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Internship ID</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Details</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Status</th>
                <th className="p-4 font-bold text-gray-700 text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length > 0 ? applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-xs">
                        {app.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{app.first_name} {app.last_name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12}/> {app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-700">{app.internship_id}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {app.linkedin && <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-xs text-orange hover:underline flex items-center gap-1"><LinkIcon size={12}/> LinkedIn</a>}
                      {app.resume && <a href={app.resume} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1"><FileText size={12}/> Resume</a>}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'pending' ? 'bg-orange/10 text-orange' : 
                      app.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14}/> {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InternshipApplicationsView;
