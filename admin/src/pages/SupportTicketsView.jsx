import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LifeBuoy, Search, Filter, MessageSquare, 
  CheckCircle2, Clock, AlertTriangle, Send, User, Lock, X
} from 'lucide-react';

export default function SupportTicketsView() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/tickets`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const fetchTicketDetails = async (ticketId) => {
    try {
      const res = await fetch(`${baseUrl}/api/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTicket(data.data);
        setReplies(data.data.replies || []);
      }
    } catch (err) {
      console.error('Failed to fetch ticket details:', err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      const res = await fetch(`${baseUrl}/api/tickets/${selectedTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: replyMessage.trim(),
          is_internal_note: isInternalNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyMessage('');
        setIsInternalNote(false);
        fetchTicketDetails(selectedTicket.id);
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`${baseUrl}/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchTicketDetails(selectedTicket.id);
        fetchTickets();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Client Support Desk</h1>
          <p className="text-sm text-gray-500 mt-1">Resolve client tickets, SLA incidents, and maintain internal technical notes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col h-[calc(100vh-220px)]">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="text" 
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:border-orange"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket.id}
                onClick={() => fetchTicketDetails(ticket.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTicket?.id === ticket.id 
                    ? 'border-orange bg-orange/5 shadow-sm' 
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{ticket.subject}</h4>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                    ticket.priority === 'urgent' ? 'bg-red-50 text-red-600' :
                    ticket.priority === 'high' ? 'bg-orange/10 text-orange' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                  <span>{ticket.client_name || 'Client'}</span>
                  <span className={`capitalize font-bold ${ticket.status === 'resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && !loading && (
              <div className="text-center py-12 text-xs text-gray-400">No support tickets found</div>
            )}
          </div>
        </div>

        {/* Ticket Detail & Conversation View */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-[calc(100vh-220px)] overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{selectedTicket.subject}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    From <span className="font-semibold text-gray-700">{selectedTicket.client_name}</span> ({selectedTicket.client_email})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:border-orange focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_on_client">Waiting on Client</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Conversation Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/30">
                {/* Initial Description */}
                <div className="p-4 bg-white border border-gray-100 rounded-xl text-xs shadow-sm">
                  <span className="font-bold text-gray-800 block mb-1">Issue Description:</span>
                  <p className="text-gray-600 whitespace-pre-line">{selectedTicket.description}</p>
                </div>

                {/* Replies Thread */}
                {replies.map(reply => (
                  <div 
                    key={reply.id}
                    className={`p-3.5 rounded-xl text-xs max-w-xl ${
                      reply.is_internal_note 
                        ? 'bg-amber-50/80 border border-amber-200 ml-auto'
                        : reply.author_role === 'admin' || reply.author_role === 'staff'
                        ? 'bg-orange/5 border border-orange/20 ml-auto'
                        : 'bg-white border border-gray-200 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] font-bold text-gray-400">
                      <span className="flex items-center gap-1">
                        {reply.is_internal_note && <Lock size={12} className="text-amber-600" />}
                        {reply.author_name} ({reply.is_internal_note ? 'Internal Note' : reply.author_role || 'User'})
                      </span>
                      <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-gray-800">{reply.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Input Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3 mb-2 px-1">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isInternalNote} 
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="rounded text-orange focus:ring-orange" 
                    />
                    <Lock size={12} className={isInternalNote ? 'text-amber-600 font-bold' : 'text-gray-400'} />
                    <span className={isInternalNote ? 'text-amber-700 font-bold' : ''}>Internal Staff Note (Hidden from client)</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={isInternalNote ? "Write an internal technical note..." : "Type response to client..."}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    className={`px-4 py-2 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                      isInternalNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-orange hover:bg-orange-dark'
                    }`}
                  >
                    <Send size={14} /> Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <LifeBuoy size={40} className="text-gray-300 mb-2" />
              <p className="text-xs font-semibold">Select a ticket from the left panel to inspect replies & provide support</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
