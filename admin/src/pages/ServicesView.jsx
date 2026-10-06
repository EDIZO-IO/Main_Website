import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Edit, Trash2, Plus, Search, Layers, DollarSign, 
  ExternalLink, Sparkles, CheckCircle, RefreshCw, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicesView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`${baseUrl}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Delete service error:', error);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    services.forEach(s => { if (s.category) set.add(s.category); });
    return Array.from(set);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = 
        (s.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [services, searchTerm, categoryFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Services</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Enterprise Services</h1>
          <p className="text-sm text-gray-500 mt-1">Configure service offerings, pricing models, and client deliverables.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData} 
            className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded-xl shadow-sm transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin text-orange' : ''} />
          </button>
          <button 
            onClick={() => navigate('/services/new')} 
            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange hover:bg-orange-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Add New Service
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === 'all' ? 'bg-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Categories ({services.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat ? 'bg-orange text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(s => (
          <div 
            key={s.id} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange/30 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange/10 text-orange">
                  {s.category || 'General'}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => navigate(`/services/${s.id}/edit`)} 
                    className="p-1.5 text-gray-400 hover:text-orange hover:bg-orange/5 rounded-lg transition-colors cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteService(s.id)} 
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange transition-colors">
                {s.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                {s.description || 'No description available for this service.'}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900 text-sm">
                {s.price === 'Custom' || !s.price || s.price === '0' ? 'Custom Quote' : `₹${s.price}`}
              </span>
              <button
                onClick={() => navigate(`/services/${s.id}/edit`)}
                className="text-orange font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Configure &rarr;
              </button>
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="font-bold text-gray-600 text-sm">No services found.</p>
            <button 
              onClick={() => navigate('/services/new')}
              className="mt-3 px-4 py-2 bg-orange text-white text-xs font-bold rounded-xl shadow-sm hover:bg-orange-dark transition-colors"
            >
              + Create First Service
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ServicesView;

