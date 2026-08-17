import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Calendar, Shield, Globe } from 'lucide-react';

const ContactMessagesView = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/admin/contact-messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token]);

  if (loading) return <div className="p-8">Loading Messages...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Contact Messages</h1>
        <p className="text-gray-500">Inquiries submitted from the public website with anti-abuse & IP tracking metadata.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {messages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {messages.map(msg => (
              <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange/10 text-orange rounded-full flex items-center justify-center font-bold">
                      {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{msg.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={14}/> {msg.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                      <Calendar size={12}/> {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.ip_address && (
                        <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-mono flex items-center gap-1 border border-gray-200" title={`User Agent: ${msg.user_agent || 'Unknown'}`}>
                          <Globe size={11} className="text-gray-400" /> {msg.ip_address}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${msg.status === 'unread' ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-500'}`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-sm font-bold text-gray-700 mb-1">Subject: {msg.subject}</p>
                  <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">No contact messages received yet.</div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesView;
