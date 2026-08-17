import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Briefcase, Calendar, CheckCircle, Clock } from 'lucide-react';

const LeadsInboxView = () => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [messagesRes, requestsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/contact-messages`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/admin/requests`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const messagesData = await messagesRes.json();
      const requestsData = await requestsRes.json();
      
      const formattedMessages = messagesData.map(m => ({ ...m, type: 'contact' }));
      const formattedRequests = requestsData.map(r => ({ 
        ...r, 
        type: 'service_request', 
        name: r.user_name || 'Client', 
        email: r.user_email || 'client@example.com',
        subject: `Service Request: ${r.service_id}`
      }));

      const combined = [...formattedMessages, ...formattedRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setLeads(combined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Leads Inbox</h1>
          <p className="text-gray-500">Manage contact inquiries and service requests.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-6 font-medium">Lead Type</th>
                <th className="p-6 font-medium">Contact Details</th>
                <th className="p-6 font-medium">Subject / Service</th>
                <th className="p-6 font-medium">Date</th>
                <th className="p-6 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">Loading leads...</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500">No leads found.</td></tr>
              ) : (
                leads.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        lead.type === 'contact' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {lead.type === 'contact' ? <MessageSquare size={14} /> : <Briefcase size={14} />}
                        {lead.type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-gray-900">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </td>
                    <td className="p-6 max-w-[300px]">
                      <p className="font-medium text-gray-800 truncate">{lead.subject}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} /> {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        lead.status === 'pending' || lead.status === 'unread' ? 'bg-orange/10 text-orange' : 'bg-green-100 text-green-600'
                      }`}>
                        {lead.status === 'pending' || lead.status === 'unread' ? <Clock size={12} /> : <CheckCircle size={12} />}
                        {lead.status}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsInboxView;
