import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const fetchApi = async (url, options = {}, token) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    }
  });
  if (!res.ok) throw new Error('API Request failed');
  return res.json();
};

const ManageContactView = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [hero, setHero] = useState({
    title: "",
    subtitle: ""
  });

  useEffect(() => {
    loadContactPage();
  }, []);

  const loadContactPage = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/pages/contact', {}, token);
      
      const parseJson = (str) => typeof str === 'string' ? JSON.parse(str) : str;

      setHero(data.sections?.hero ? parseJson(data.sections.hero) : {
        title: "Let's Start a Conversation",
        subtitle: "Have a project in mind, a question about our services, or want to apply for an internship? Reach out to us — we'd love to hear from you."
      });
    } catch (err) {
      console.error("Failed to load contact page", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetchApi('/api/pages/contact/sections/hero', { method: 'PUT', body: JSON.stringify({ content: hero }) }, token);
      
      setSuccessMsg('Contact page updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Contact Page content...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Contact Page</h1>
          <p className="text-gray-500 mt-1">Customize the text displayed on the contact page</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Saving...' : <><Save size={20} /> Publish Changes</>}
        </button>
      </div>
      
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 font-medium">
          <CheckCircle size={20} /> {successMsg}
        </motion.div>
      )}

      {/* Hero Section Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Header Section</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input 
              type="text" 
              value={hero.title}
              onChange={e => setHero({...hero, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description Text</label>
            <textarea 
              value={hero.subtitle}
              onChange={e => setHero({...hero, subtitle: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContactView;
