import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Plus, Search, CheckCircle2, Clock, 
  Send, ExternalLink, Copy, Check, Eye, Trash2, X
} from 'lucide-react';

export default function ProposalsView() {
  const { token } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Proposal Creation Form State
  const [title, setTitle] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: '' }]);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setProposals(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: '' }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => acc + (Number(curr.quantity || 0) * Number(curr.unit_price || 0)), 0);
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/proposals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          valid_until: validUntil,
          currency,
          items: items.map(item => ({
            description: item.description,
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unit_price || 0)
          }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setTitle('');
        setValidUntil('');
        setItems([{ description: '', quantity: 1, unit_price: '' }]);
        fetchProposals();
      }
    } catch (err) {
      console.error('Failed to create proposal:', err);
    }
  };

  const handleCopyLink = (uuid) => {
    const publicUrl = `${window.location.origin}/proposal/${uuid}`;
    navigator.clipboard.writeText(publicUrl);
    setCopiedId(uuid);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold">Approved / Signed</span>;
      case 'sent':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold">Sent to Client</span>;
      case 'viewed':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs px-2.5 py-1 rounded-full font-bold">Viewed</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-bold">Declined</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2.5 py-1 rounded-full font-bold">Draft</span>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Proposals & Digital Signatures</h1>
          <p className="text-sm text-gray-500 mt-1">Generate dynamic scopes, estimate line-items, and track e-signatures</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> New Proposal
        </button>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-bold text-base text-gray-900 leading-snug">{proposal.title}</h3>
                {getStatusBadge(proposal.status)}
              </div>

              {proposal.client_name && (
                <p className="text-xs text-gray-500 mb-4">
                  Prepared for: <span className="font-bold text-gray-800">{proposal.client_name}</span>
                </p>
              )}

              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Total Amount</span>
                  <span className="font-extrabold text-gray-900 text-sm">
                    {proposal.currency} {Number(proposal.total_amount || 0).toLocaleString()}
                  </span>
                </div>
                {proposal.valid_until && (
                  <div className="flex justify-between text-gray-400">
                    <span>Valid Until</span>
                    <span>{new Date(proposal.valid_until).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <button 
                onClick={() => handleCopyLink(proposal.uuid)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                {copiedId === proposal.uuid ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copiedId === proposal.uuid ? 'Copied' : 'E-Sign Link'}
              </button>
              <button 
                onClick={() => handleCopyLink(proposal.uuid)}
                className="p-2 text-gray-400 hover:text-orange hover:bg-orange/10 rounded-xl transition-colors"
              >
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}

        {proposals.length === 0 && !loading && (
          <div className="col-span-full bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <FileText className="mx-auto text-gray-300 mb-3" size={40} />
            <h3 className="font-bold text-gray-800 text-base">No proposals created yet</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Create a proposal to share project estimates, line items, and gather client digital signatures.</p>
          </div>
        )}
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Create New Client Proposal</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="overflow-y-auto py-4 space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Proposal Title *</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Custom SaaS Architecture & Cloud Setup"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Valid Until Date</label>
                  <input 
                    type="date" 
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-700">Scope of Work & Line Items</label>
                  <button 
                    type="button" 
                    onClick={handleAddItem}
                    className="text-xs font-bold text-orange hover:text-orange-dark flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Line Item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <input 
                        type="text" 
                        required
                        placeholder="Deliverable description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange"
                      />
                      <input 
                        type="number" 
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none text-center"
                      />
                      <input 
                        type="number" 
                        required
                        placeholder="Unit Price (₹)"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                        className="w-28 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none text-right font-semibold"
                      />
                      {items.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subtotal preview */}
                <div className="mt-3 p-3 bg-orange/5 border border-orange/20 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700">Calculated Proposal Total:</span>
                  <span className="font-extrabold text-orange text-base">₹{calculateTotal().toLocaleString()}</span>
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
                  Save & Generate Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
