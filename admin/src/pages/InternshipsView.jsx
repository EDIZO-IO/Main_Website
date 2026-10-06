import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Edit, Trash2, Plus, Search, GraduationCap, Clock, 
  MapPin, DollarSign, Users, RefreshCw, AlertCircle, Sparkles 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const InternshipsView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/internships`);
      const data = await res.json();
      setInternships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load internships:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship track?")) return;
    try {
      await fetch(`${baseUrl}/api/admin/internships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Delete internship error:', error);
    }
  };

  const categories = useMemo(() => {
    const set = new Set();
    internships.forEach(i => { if (i.category) set.add(i.category); });
    return Array.from(set);
  }, [internships]);

  const filteredInternships = useMemo(() => {
    return internships.filter(i => {
      const matchesSearch = 
        (i.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (i.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (i.category?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCat = categoryFilter === 'all' || i.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [internships, searchTerm, categoryFilter]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Internships</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Internship Programs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage industrial training curricula, stipends, and applicant tracks.</p>
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
            onClick={() => navigate('/internships/new')} 
            className="flex items-center gap-1.5 px-4 py-2.5 bg-orange hover:bg-orange-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus size={16} /> Create Track
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
            All Tracks ({internships.length})
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
            placeholder="Search tracks, roles, tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map(i => (
          <div 
            key={i.id} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange/30 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700">
                  {i.category || 'Engineering'}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => navigate(`/internships/${i.id}/edit`)} 
                    className="p-1.5 text-gray-400 hover:text-orange hover:bg-orange/5 rounded-lg transition-colors cursor-pointer"
                    title="Edit Internship"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteInternship(i.id)} 
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Internship"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange transition-colors">
                {i.title}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">{i.company || 'EDIZO Labs'}</p>

              <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 font-medium">
                  <Clock size={12} className="text-orange" /> {i.duration ? `${i.duration} Months` : '3 Months'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 font-medium capitalize">
                  <MapPin size={12} className="text-blue-500" /> {i.mode || 'Online'}
                </span>
                {i.stipend && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 font-bold">
                    <DollarSign size={12} /> {i.stipend}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <Link 
                to="/applications"
                className="text-gray-500 hover:text-orange font-bold flex items-center gap-1 transition-colors"
              >
                <Users size={13} /> View Applicants
              </Link>
              <button
                onClick={() => navigate(`/internships/${i.id}/edit`)}
                className="text-orange font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Manage &rarr;
              </button>
            </div>
          </div>
        ))}

        {filteredInternships.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="font-bold text-gray-600 text-sm">No internship tracks found.</p>
            <button 
              onClick={() => navigate('/internships/new')}
              className="mt-3 px-4 py-2 bg-orange text-white text-xs font-bold rounded-xl shadow-sm hover:bg-orange-dark transition-colors"
            >
              + Create First Track
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default InternshipsView;
