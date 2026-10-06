import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Receipt, Plus, Search, DollarSign, CheckCircle2, 
  Clock, AlertCircle, Download, CreditCard, X
} from 'lucide-react';

export default function BillingInvoicesView() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Invoice creation form
  const [clientId, setClientId] = useState(1);
  const [placeOfSupply, setPlaceOfSupply] = useState('Tamil Nadu (33)');
  const [gstTreatment, setGstTreatment] = useState('registered');
  const [subtotal, setSubtotal] = useState('');
  const [cgstRate, setCgstRate] = useState(9);
  const [sgstRate, setSgstRate] = useState(9);
  const [igstRate, setIgstRate] = useState(0);
  const [dueDate, setDueDate] = useState('');

  // Payment recording form
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/billing/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/billing/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          client_id: clientId,
          place_of_supply: placeOfSupply,
          gst_treatment: gstTreatment,
          subtotal: Number(subtotal),
          cgst_rate: Number(cgstRate),
          sgst_rate: Number(sgstRate),
          igst_rate: Number(igstRate),
          due_date: dueDate || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setSubtotal('');
        fetchInvoices();
      }
    } catch (err) {
      console.error('Failed to create invoice:', err);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    try {
      const res = await fetch(`${baseUrl}/api/billing/invoices/${selectedInvoice.id}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(paymentAmount),
          method: paymentMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentModal(false);
        setSelectedInvoice(null);
        setPaymentAmount('');
        fetchInvoices();
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-full font-bold">Paid in Full</span>;
      case 'partially_paid':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-1 rounded-full font-bold">Partially Paid</span>;
      case 'sent':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-1 rounded-full font-bold">Sent / Awaiting</span>;
      case 'overdue':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-1 rounded-full font-bold">Overdue</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2.5 py-1 rounded-full font-bold">Draft</span>;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">GST Invoicing & Payments</h1>
          <p className="text-sm text-gray-500 mt-1">Generate compliant GST tax invoices (CGST/SGST/IGST) and track receipts</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> Create GST Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 pl-6">Invoice No / FY</th>
              <th className="p-4">Client</th>
              <th className="p-4">Subtotal</th>
              <th className="p-4">GST Tax</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Amount Paid</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map(inv => {
              const totalTax = Number(inv.cgst_amount || 0) + Number(inv.sgst_amount || 0) + Number(inv.igst_amount || 0);
              const balanceDue = Number(inv.total_amount) - Number(inv.amount_paid);

              return (
                <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-extrabold text-gray-900">{inv.invoice_no}</div>
                    <div className="text-xs text-gray-400">FY: {inv.fy_year}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{inv.client_name || `Client #${inv.client_id}`}</div>
                    <div className="text-xs text-gray-400">{inv.client_email || ''}</div>
                  </td>
                  <td className="p-4 font-semibold text-gray-700">₹{Number(inv.subtotal).toLocaleString()}</td>
                  <td className="p-4 font-semibold text-gray-500">₹{totalTax.toLocaleString()}</td>
                  <td className="p-4 font-extrabold text-gray-900 text-base">₹{Number(inv.total_amount).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="font-bold text-emerald-600">₹{Number(inv.amount_paid).toLocaleString()}</div>
                    {balanceDue > 0 && <div className="text-[11px] text-rose-500 font-semibold">Due: ₹{balanceDue.toLocaleString()}</div>}
                  </td>
                  <td className="p-4">{getStatusBadge(inv.status)}</td>
                  <td className="p-4 text-right pr-6">
                    {balanceDue > 0 && (
                      <button 
                        onClick={() => { setSelectedInvoice(inv); setPaymentAmount(balanceDue); setShowPaymentModal(true); }}
                        className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                      >
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="p-12 text-center text-gray-400">
                  <Receipt className="mx-auto mb-2 text-gray-300" size={36} />
                  No invoices generated yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New GST Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Subtotal (Pre-Tax Amount ₹) *</label>
                <input 
                  type="number" 
                  required
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Place of Supply</label>
                  <input 
                    type="text" 
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">GST Treatment</label>
                  <select 
                    value={gstTreatment}
                    onChange={(e) => setGstTreatment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                  >
                    <option value="registered">Registered Business (B2B)</option>
                    <option value="unregistered">Unregistered Consumer (B2C)</option>
                    <option value="sez">SEZ Unit</option>
                    <option value="export">Export of Services (Zero-rated)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">CGST Rate (%)</label>
                  <input 
                    type="number" 
                    value={cgstRate}
                    onChange={(e) => setCgstRate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">SGST Rate (%)</label>
                  <input 
                    type="number" 
                    value={sgstRate}
                    onChange={(e) => setSgstRate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">IGST Rate (%)</label>
                  <input 
                    type="number" 
                    value={igstRate}
                    onChange={(e) => setIgstRate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
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
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              For Invoice <span className="font-bold text-gray-800">{selectedInvoice.invoice_no}</span>
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Amount Received (₹) *</label>
                <input 
                  type="number" 
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                >
                  <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                  <option value="upi">UPI / GPay</option>
                  <option value="razorpay">Razorpay Online Gateway</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                >
                  Save Payment Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
