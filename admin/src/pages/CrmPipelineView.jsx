import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, Plus, Search, Filter, Flame, DollarSign, 
  Clock, CheckCircle, XCircle, ArrowRight, MessageSquare, ChevronRight, X
} from 'lucide-react';

const STAGES = [
  { id: 'new', label: 'New Lead', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'qualified', label: 'Qualified', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'proposal', label: 'Proposal Sent', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange/10 text-orange border-orange/30' },
  { id: 'won', label: 'Deal Won', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'lost', label: 'Deal Lost', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export default function CrmPipelineView() {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table'
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadNotes, setLeadNotes] = useState([]);
  const [leadActivities, setLeadActivities] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    contact_name: '',
    company_name: '',
    email: '',
    phone: '',
    estimated_value: '',
    temperature: 'warm',
    stage: 'new'
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/crm/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const fetchLeadDetails = async (leadId) => {
    try {
      const res = await fetch(`${baseUrl}/api/crm/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSelectedLead(data.data);
        setLeadNotes(data.data.notes || []);
        setLeadActivities(data.data.activities || []);
      }
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
    }
  };

  const handleStageChange = async (leadId, newStage) => {
    try {
      const res = await fetch(`${baseUrl}/api/crm/leads/${leadId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });
      const data = await res.json();
      if (data.success) {
        fetchLeads();
        if (selectedLead && selectedLead.id === leadId) {
          fetchLeadDetails(leadId);
        }
      }
    } catch (err) {
      console.error('Stage change error:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;
    try {
      const res = await fetch(`${baseUrl}/api/crm/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ note: newNote.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setNewNote('');
        fetchLeadDetails(selectedLead.id);
      }
    } catch (err) {
      console.error('Add note error:', err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/crm/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          contact_name: '',
          company_name: '',
          email: '',
          phone: '',
          estimated_value: '',
          temperature: 'warm',
          stage: 'new'
        });
        fetchLeads();
      }
    } catch (err) {
      console.error('Create lead error:', err);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CRM Deals Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Manage client opportunities, lead scores, and revenue conversions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'kanban' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Pipeline Board
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Table View
            </button>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
          >
            <Plus size={16} /> Add Opportunity
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search leads by contact, company or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/20"
          />
        </div>
        <div className="text-xs font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredLeads.length}</span> active leads
        </div>
      </div>

      {/* Kanban Board View */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
            const totalStageValue = stageLeads.reduce((acc, curr) => acc + Number(curr.estimated_value || 0), 0);

            return (
              <div key={stage.id} className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-3 flex flex-col min-w-[240px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{stageLeads.length}</span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">
                    ₹{totalStageValue.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-320px)]">
                  {stageLeads.map(lead => (
                    <div 
                      key={lead.id}
                      onClick={() => fetchLeadDetails(lead.id)}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-orange/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-gray-900 group-hover:text-orange transition-colors">
                          {lead.contact_name}
                        </h4>
                        {lead.temperature === 'hot' && (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                            <Flame size={12} /> Hot
                          </span>
                        )}
                      </div>

                      {lead.company_name && (
                        <p className="text-xs font-medium text-gray-500 mb-2 truncate">
                          {lead.company_name}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <span className="font-bold text-gray-900">
                          {lead.estimated_value ? `₹${Number(lead.estimated_value).toLocaleString()}` : '—'}
                        </span>
                        <span className="text-[11px] font-semibold text-gray-400">Score: {lead.score}</span>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                      No leads in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {activeTab === 'table' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Contact & Company</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Est. Value</th>
                <th className="p-4">Temp / Score</th>
                <th className="p-4">Email & Phone</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-gray-900">{lead.contact_name}</div>
                    <div className="text-xs text-gray-500">{lead.company_name || 'Individual'}</div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={lead.stage}
                      onChange={(e) => handleStageChange(lead.id, e.target.value)}
                      className="text-xs font-bold border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-orange"
                    >
                      {STAGES.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    {lead.estimated_value ? `₹${Number(lead.estimated_value).toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded capitalize ${lead.temperature === 'hot' ? 'bg-red-50 text-red-600' : lead.temperature === 'warm' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        {lead.temperature}
                      </span>
                      <span className="text-xs text-gray-400 font-semibold">({lead.score})</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-600">
                    <div>{lead.email || '—'}</div>
                    <div className="text-gray-400">{lead.phone || ''}</div>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => fetchLeadDetails(lead.id)}
                      className="px-3 py-1.5 text-xs font-bold text-orange hover:bg-orange/10 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedLead.contact_name}</h3>
                <p className="text-xs text-gray-500">{selectedLead.company_name || 'Individual Lead'}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block mb-1">Email</span>
                  <span className="font-bold text-gray-900">{selectedLead.email || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block mb-1">Phone</span>
                  <span className="font-bold text-gray-900">{selectedLead.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block mb-1">Estimated Value</span>
                  <span className="font-bold text-gray-900">₹{Number(selectedLead.estimated_value || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-semibold block mb-1">Current Stage</span>
                  <select 
                    value={selectedLead.stage}
                    onChange={(e) => handleStageChange(selectedLead.id, e.target.value)}
                    className="font-bold border border-gray-200 rounded p-1 bg-white"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes & Activity Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-orange" /> Lead Notes & Discussion
                </h4>
                
                <form onSubmit={handleAddNote} className="mb-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add an update or note about this lead..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-orange"
                    />
                    <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black">
                      Add Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5">
                  {leadNotes.map(note => (
                    <div key={note.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs">
                      <p className="text-gray-800">{note.note}</p>
                      <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                        <span>By {note.author_name || 'Admin'}</span>
                        <span>{new Date(note.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {leadNotes.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No notes logged for this lead yet</p>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-purple-600" /> Activity Timeline
                </h4>
                <div className="space-y-3 border-l-2 border-gray-100 pl-4 ml-2 text-xs">
                  {leadActivities.map(act => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-orange rounded-full ring-4 ring-white" />
                      <p className="font-bold text-gray-800">{act.activity_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-gray-500 mt-0.5">{act.details}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Opportunity</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Contact Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    placeholder="e.g. Apex Tech Ltd."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="rahul@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Estimated Value (₹)</label>
                  <input 
                    type="number" 
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({...formData, estimated_value: e.target.value})}
                    placeholder="50000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Temperature</label>
                  <select 
                    value={formData.temperature}
                    onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                  >
                    <option value="hot">Hot 🔥</option>
                    <option value="warm">Warm ⚡</option>
                    <option value="cold">Cold ❄️</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Initial Stage</label>
                  <select 
                    value={formData.stage}
                    onChange={(e) => setFormData({...formData, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                  >
                    {STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
