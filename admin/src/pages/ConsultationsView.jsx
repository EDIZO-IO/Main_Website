import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, Plus, Video, CheckCircle2, 
  XCircle, User, Mail, ExternalLink, X
} from 'lucide-react';

export default function ConsultationsView() {
  const { token } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSlotModal, setShowSlotModal] = useState(false);

  // Slot Form State
  const [slotDate, setSlotDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:45');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resCons, resSlots] = await Promise.all([
        fetch(`${baseUrl}/api/consultations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/consultations/slots`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dataCons = await resCons.json();
      const dataSlots = await resSlots.json();

      if (dataCons.success) setConsultations(dataCons.data || []);
      if (dataSlots.success) setSlots(dataSlots.data || []);
    } catch (err) {
      console.error('Failed to fetch consultations:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotDate || !startTime || !endTime) return;
    try {
      const slot_start = `${slotDate} ${startTime}:00`;
      const slot_end = `${slotDate} ${endTime}:00`;

      const res = await fetch(`${baseUrl}/api/consultations/slots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          slots: [{ slot_start, slot_end }]
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowSlotModal(false);
        setSlotDate('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create slot:', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${baseUrl}/api/consultations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update consultation:', err);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Consultation Scheduler</h1>
          <p className="text-sm text-gray-500 mt-1">Manage discovery call availability, client bookings, and meeting links</p>
        </div>
        <button 
          onClick={() => setShowSlotModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> Open Availability Slot
        </button>
      </div>

      {/* Booked Sessions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Video size={18} className="text-orange" /> Scheduled Discovery Consultations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consultations.map(c => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-gray-900">{c.topic || 'General Discovery Call'}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded capitalize ${
                      c.status === 'scheduled' ? 'bg-blue-50 text-blue-700' :
                      c.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <User size={12} />
                      <span className="font-bold text-gray-800">{c.guest_name || c.client_name || 'Guest'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Mail size={12} />
                      <span>{c.guest_email || c.registered_email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange font-semibold pt-1">
                      <Clock size={12} />
                      <span>{new Date(c.slot_start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a 
                    href={c.meeting_link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Video size={14} /> Join Meeting
                  </a>
                  <select 
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className="text-xs font-bold border border-gray-200 rounded-lg p-1.5 bg-gray-50"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
                </div>
              </div>
            ))}

            {consultations.length === 0 && !loading && (
              <div className="col-span-full p-8 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
                No client consultations booked yet
              </div>
            )}
          </div>
        </div>

        {/* Available Open Slots */}
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-purple-600" /> Open Unbooked Slots ({slots.length})
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {slots.map(s => (
              <div key={s.id} className="px-3.5 py-2 bg-purple-50/70 border border-purple-200 rounded-xl text-xs font-bold text-purple-900 flex items-center gap-2">
                <Clock size={12} />
                <span>{new Date(s.slot_start).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            ))}
            {slots.length === 0 && !loading && (
              <p className="text-xs text-gray-400 italic">No future slots currently published for booking</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Open Availability Slot</h3>
              <button onClick={() => setShowSlotModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Date *</label>
                <input 
                  type="date" 
                  required
                  value={slotDate}
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Time *</label>
                  <input 
                    type="time" 
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Time *</label>
                  <input 
                    type="time" 
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowSlotModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Publish Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
