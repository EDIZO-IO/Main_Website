import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react';
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

const ManageHomeView = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [hero, setHero] = useState({
    title: "", subtitle: "", ctaPrimary: "", ctaSecondary: ""
  });
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [cta, setCta] = useState({ title: "", subtitle: "", btnText: "" });

  useEffect(() => {
    loadHomePage();
  }, []);

  const loadHomePage = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/pages/home', {}, token);
      
      const parseJson = (str) => typeof str === 'string' ? JSON.parse(str) : str;

      setHero(data.sections?.hero ? parseJson(data.sections.hero) : {
        title: "Building the Next Generation of Tech Leaders",
        subtitle: "Empowering students and businesses with cutting-edge IT services and intensive training programs.",
        ctaPrimary: "Explore Internships",
        ctaSecondary: "Our Services"
      });

      setStats(data.sections?.stats ? parseJson(data.sections.stats) : [
        { label: "Projects Completed", value: "50+" },
        { label: "Happy Clients", value: "30+" }
      ]);

      setTestimonials(data.sections?.testimonials ? parseJson(data.sections.testimonials) : [
        { quote: "Great company", name: "Client", role: "CEO" }
      ]);

      setCta(data.sections?.cta ? parseJson(data.sections.cta) : {
        title: "Ready to build something amazing?",
        subtitle: "Let's bring your vision to life.",
        btnText: "Contact Us Today"
      });

    } catch (err) {
      console.error("Failed to load home page", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      await fetchApi('/api/pages/home/sections/hero', { method: 'PUT', body: JSON.stringify({ content: hero }) }, token);
      await fetchApi('/api/pages/home/sections/stats', { method: 'PUT', body: JSON.stringify({ content: stats }) }, token);
      await fetchApi('/api/pages/home/sections/testimonials', { method: 'PUT', body: JSON.stringify({ content: testimonials }) }, token);
      await fetchApi('/api/pages/home/sections/cta', { method: 'PUT', body: JSON.stringify({ content: cta }) }, token);
      
      setSuccessMsg('Homepage updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Home Page content...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Homepage</h1>
          <p className="text-gray-500 mt-1">Customize the sections on the landing page</p>
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

      {/* Hero Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Main Title</label>
            <input type="text" value={hero.title} onChange={e => setHero({...hero, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
            <textarea value={hero.subtitle} onChange={e => setHero({...hero, subtitle: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Button Text</label>
            <input type="text" value={hero.ctaPrimary} onChange={e => setHero({...hero, ctaPrimary: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Button Text</label>
            <input type="text" value={hero.ctaSecondary} onChange={e => setHero({...hero, ctaSecondary: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Statistics Section</h2>
          <button onClick={() => setStats([...stats, { label: "New Stat", value: "0+" }])} className="text-sm font-bold text-orange flex items-center gap-1"><Plus size={16}/> Add Stat</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
              <button onClick={() => setStats(stats.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
              <label className="block text-xs font-bold text-gray-500 mb-1">Value (e.g. 50+)</label>
              <input type="text" value={s.value} onChange={e => { const n = [...stats]; n[idx].value = e.target.value; setStats(n); }} className="w-full p-2 mb-2 bg-white border border-gray-200 rounded focus:border-orange text-center font-bold text-xl" />
              <label className="block text-xs font-bold text-gray-500 mb-1">Label</label>
              <input type="text" value={s.label} onChange={e => { const n = [...stats]; n[idx].label = e.target.value; setStats(n); }} className="w-full p-2 bg-white border border-gray-200 rounded focus:border-orange text-center text-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
          <button onClick={() => setTestimonials([...testimonials, { quote: "Great", name: "Name", role: "Role" }])} className="text-sm font-bold text-orange flex items-center gap-1"><Plus size={16}/> Add Testimonial</button>
        </div>
        <div className="space-y-4">
          {testimonials.map((t, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group flex gap-4">
              <div className="flex-1">
                <textarea value={t.quote} onChange={e => { const n = [...testimonials]; n[idx].quote = e.target.value; setTestimonials(n); }} className="w-full p-3 mb-2 bg-white border border-gray-200 rounded-lg focus:border-orange text-sm italic" rows={2} />
                <div className="flex gap-4">
                  <input type="text" value={t.name} onChange={e => { const n = [...testimonials]; n[idx].name = e.target.value; setTestimonials(n); }} className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm font-bold" />
                  <input type="text" value={t.role} onChange={e => { const n = [...testimonials]; n[idx].role = e.target.value; setTestimonials(n); }} className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-500" />
                </div>
              </div>
              <button onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500 self-center p-2"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Bottom CTA Banner</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input type="text" value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
            <input type="text" value={cta.subtitle} onChange={e => setCta({...cta, subtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Button Text</label>
            <input type="text" value={cta.btnText} onChange={e => setCta({...cta, btnText: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHomeView;
