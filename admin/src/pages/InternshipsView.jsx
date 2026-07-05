import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InternshipsView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/internships`);
      const data = await res.json();
      setInternships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    fetchData();
  }, [fetchData]);

  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/admin/internships/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8">Loading Internships...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Manage Internships</h1>
          <p className="text-gray-500">View and organize current internship programs.</p>
        </div>
        <button onClick={() => navigate('/internships/new')} className="flex items-center gap-2 px-6 py-2 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-sm">
          <FilePlus size={16} /> Add Internship
        </button>
      </div>

      <div className="grid gap-4">
        {internships.map(i => (
          <div key={i.id} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{i.title}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">{i.company} &bull; <span className="text-orange">{i.category}</span> &bull; {i.duration} Months</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate(`/internships/${i.id}/edit`)} className="p-2 text-gray-400 hover:text-orange transition-colors"><Edit size={20} /></button>
              <button onClick={() => deleteInternship(i.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
        {internships.length === 0 && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">No internships found. Create one!</div>
        )}
      </div>
    </div>
  );
};

export default InternshipsView;
