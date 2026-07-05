import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8">Loading Services...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Manage Services</h1>
          <p className="text-gray-500">View and organize enterprise services.</p>
        </div>
        <button onClick={() => navigate('/services/new')} className="flex items-center gap-2 px-6 py-2 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-sm">
          <FilePlus size={16} /> Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1"><span className="text-orange">{s.category}</span> &bull; {s.price === 'Custom' ? 'Custom Pricing' : `₹${s.price}`}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/services/${s.id}/edit`)} className="p-2 text-gray-400 hover:text-orange transition-colors"><Edit size={20} /></button>
              <button onClick={() => deleteService(s.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">No services found. Create one!</div>
        )}
      </div>
    </div>
  );
};

export default ServicesView;

