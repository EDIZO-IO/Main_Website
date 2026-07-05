import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Mail, Calendar, DollarSign } from 'lucide-react';

const ServiceRequestsView = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/admin/requests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch service requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [token]);

  if (loading) return <div className="p-8">Loading Requests...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Service Requests</h1>
        <p className="text-gray-500">Review project inquiries and service requests from clients.</p>
      </div>

      <div className="grid gap-6">
        {requests.length > 0 ? requests.map(req => (
          <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:border-orange/50 transition-colors">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-600 mb-3">
                  Service ID: {req.service_id}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold">
                    {req.user_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{req.user_name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Mail size={14}/> {req.user_email}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                  <Calendar size={14}/> {new Date(req.created_at).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  req.status === 'pending' ? 'bg-orange/10 text-orange' : 
                  req.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {req.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-6 bg-gray-50/50">
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Project Details</h4>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{req.project_details}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Requirements & Budget</h4>
                <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{req.requirements || 'No specific requirements provided.'}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">
                  <DollarSign size={16} className="text-green-500"/> Budget: {req.budget || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
            No service requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsView;
