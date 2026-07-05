import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Image, CheckCircle } from 'lucide-react';

// Quick fallback for fetch if api.js isn't an axios instance
const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
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

const ManageAboutView = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [hero, setHero] = useState({
    title: "",
    subtitle: ""
  });
  
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  const [differentiators, setDifferentiators] = useState([]);
  const [story, setStory] = useState([]);
  const [storyMission, setStoryMission] = useState({ mission: "", vision: "" });
  const [cta, setCta] = useState({ title: "", subtitle: "", btnPrimary: "", btnSecondary: "" });

  useEffect(() => {
    loadAboutPage();
  }, []);

  const loadAboutPage = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/pages/about');
      
      if (data.sections?.hero) {
        setHero(typeof data.sections.hero === 'string' ? JSON.parse(data.sections.hero) : data.sections.hero);
      } else {
        setHero({
          title: "Empowering the Next Generation of Tech Leaders",
          subtitle: "EDIZO was founded with a singular vision..."
        });
      }

      if (data.sections?.team) {
        setTeam(typeof data.sections.team === 'string' ? JSON.parse(data.sections.team) : data.sections.team);
      } else {
        setTeam([
          { name: "Sarah Chen", role: "CEO & Co-founder", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
          { name: "Marcus Thorne", role: "CTO", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" }
        ]);
      }

      const parseJson = (str) => typeof str === 'string' ? JSON.parse(str) : str;

      setValues(data.sections?.values ? parseJson(data.sections.values) : [
        { icon: "Lightbulb", title: "Creativity", desc: "We think differently to deliver unique solutions." }
      ]);
      setDifferentiators(data.sections?.differentiators ? parseJson(data.sections.differentiators) : [
        "All services under one roof — no need for multiple vendors"
      ]);
      setStory(data.sections?.story ? parseJson(data.sections.story) : [
        "EDIZO was founded with a simple goal..."
      ]);
      setStoryMission(data.sections?.storyMission ? parseJson(data.sections.storyMission) : {
        mission: "To empower businesses...",
        vision: "To become a trusted global partner..."
      });
      setCta(data.sections?.cta ? parseJson(data.sections.cta) : {
        title: "Ready to start your journey?",
        subtitle: "Join the thousands...",
        btnPrimary: "Get Started Now",
        btnSecondary: "Browse Positions"
      });

    } catch (err) {
      console.error("Failed to load about page", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save Hero Section
      await fetchApi('/api/pages/about/sections/hero', {
        method: 'PUT',
        body: JSON.stringify({ content: hero })
      });
      
      // Save Team Section
      await fetchApi('/api/pages/about/sections/team', {
        method: 'PUT',
        body: JSON.stringify({ content: team })
      });
      await fetchApi('/api/pages/about/sections/values', { method: 'PUT', body: JSON.stringify({ content: values }) });
      await fetchApi('/api/pages/about/sections/differentiators', { method: 'PUT', body: JSON.stringify({ content: differentiators }) });
      await fetchApi('/api/pages/about/sections/story', { method: 'PUT', body: JSON.stringify({ content: story }) });
      await fetchApi('/api/pages/about/sections/storyMission', { method: 'PUT', body: JSON.stringify({ content: storyMission }) });
      await fetchApi('/api/pages/about/sections/cta', { method: 'PUT', body: JSON.stringify({ content: cta }) });
      
      setSuccessMsg('About page updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
    } catch (err) {
      console.error("Failed to save", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const updateTeamMember = (index, field, value) => {
    const newTeam = [...team];
    newTeam[index][field] = value;
    setTeam(newTeam);
  };

  const addTeamMember = () => {
    setTeam([...team, { name: "New Member", role: "Role", img: "https://ui-avatars.com/api/?name=New+Member&background=random" }]);
  };

  const removeTeamMember = (index) => {
    setTeam(team.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading About Page content...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage About Page</h1>
          <p className="text-gray-500 mt-1">Customize the Hero text and Team members</p>
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Main Title</label>
            <input 
              type="text" 
              value={hero.title}
              onChange={e => setHero({...hero, title: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle / Story</label>
            <textarea 
              value={hero.subtitle}
              onChange={e => setHero({...hero, subtitle: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange resize-none"
            />
          </div>
        </div>
      </div>

      {/* Team Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Leadership Team</h2>
          <button 
            onClick={addTeamMember}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
        
        <div className="space-y-6">
          {team.map((member, idx) => (
            <div key={idx} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex gap-6 items-start relative group">
              <button 
                onClick={() => removeTeamMember(idx)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Member"
              >
                <Trash2 size={20} />
              </button>
              
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 flex flex-col items-center justify-center border border-gray-300 relative group/img">
                {member.img ? (
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <Image size={24} className="text-gray-400" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-xs font-bold px-2 text-center">Image URL below</span>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={member.name}
                    onChange={e => updateTeamMember(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role / Job Title</label>
                  <input 
                    type="text" 
                    value={member.role}
                    onChange={e => updateTeamMember(idx, 'role', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={member.img}
                    onChange={e => updateTeamMember(idx, 'img', e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
          {team.length === 0 && (
            <p className="text-gray-500 text-center py-8">No team members added yet.</p>
          )}
        </div>
      </div>

      {/* Story Section Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Our Story</h2>
          <button onClick={() => setStory([...story, "New paragraph..."])} className="text-sm font-bold text-orange flex items-center gap-1"><Plus size={16}/> Add Paragraph</button>
        </div>
        <div className="space-y-4 mb-6">
          {story.map((para, idx) => (
            <div key={idx} className="relative group">
              <textarea value={para} onChange={e => { const n = [...story]; n[idx] = e.target.value; setStory(n); }} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange resize-none" />
              <button onClick={() => setStory(story.filter((_, i) => i !== idx))} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Our Mission</label>
            <textarea value={storyMission.mission} onChange={e => setStoryMission({...storyMission, mission: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Our Vision</label>
            <textarea value={storyMission.vision} onChange={e => setStoryMission({...storyMission, vision: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange resize-none" />
          </div>
        </div>
      </div>

      {/* Core Values Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Core Values</h2>
          <button onClick={() => setValues([...values, { icon: "Lightbulb", title: "Value", desc: "Description" }])} className="text-sm font-bold text-orange flex items-center gap-1"><Plus size={16}/> Add Value</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((val, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative group">
              <button onClick={() => setValues(values.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
              <label className="block text-xs font-bold text-gray-500 mb-1">Icon Name (Lightbulb, Target, Shield, Users)</label>
              <input type="text" value={val.icon} onChange={e => { const n = [...values]; n[idx].icon = e.target.value; setValues(n); }} className="w-full p-2 mb-2 bg-white border border-gray-200 rounded focus:border-orange text-sm" />
              <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
              <input type="text" value={val.title} onChange={e => { const n = [...values]; n[idx].title = e.target.value; setValues(n); }} className="w-full p-2 mb-2 bg-white border border-gray-200 rounded focus:border-orange text-sm font-bold" />
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <textarea value={val.desc} onChange={e => { const n = [...values]; n[idx].desc = e.target.value; setValues(n); }} rows={2} className="w-full p-2 bg-white border border-gray-200 rounded focus:border-orange text-sm resize-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Differentiators Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">What Makes Us Different</h2>
          <button onClick={() => setDifferentiators([...differentiators, "New point..."])} className="text-sm font-bold text-orange flex items-center gap-1"><Plus size={16}/> Add Point</button>
        </div>
        <div className="space-y-3">
          {differentiators.map((diff, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <input type="text" value={diff} onChange={e => { const n = [...differentiators]; n[idx] = e.target.value; setDifferentiators(n); }} className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
              <button onClick={() => setDifferentiators(differentiators.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500"><Trash2 size={20}/></button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section Edit */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Bottom CTA Banner</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input type="text" value={cta.title} onChange={e => setCta({...cta, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle</label>
            <input type="text" value={cta.subtitle} onChange={e => setCta({...cta, subtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Primary Button Text</label>
            <input type="text" value={cta.btnPrimary} onChange={e => setCta({...cta, btnPrimary: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Button Text</label>
            <input type="text" value={cta.btnSecondary} onChange={e => setCta({...cta, btnSecondary: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManageAboutView;
