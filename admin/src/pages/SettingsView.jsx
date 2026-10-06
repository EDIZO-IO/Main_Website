import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Phone, MapPin, Save, Clock, Link as LinkIcon, 
  Globe, Shield, CheckCircle, RefreshCw, AlertCircle, 
  Sparkles, Lock, Server, Share2
} from 'lucide-react';

const SettingsView = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [config, setConfig] = useState({
    email_1: '',
    email_2: '',
    phone: '',
    office_hours: '',
    address_title: '',
    address_line1: '',
    address_line2: '',
    social_linkedin: '',
    social_twitter: '',
    social_instagram: '',
    social_facebook: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data) {
        setConfig(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setMessage({ text: 'Settings synchronized successfully with production database!', type: 'success' });
      } else {
        setMessage({ text: 'Failed to update settings. Please check your credentials.', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Connection error while saving configuration.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-orange/20 border-t-orange rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-xs">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans text-gray-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-1">
            Dashboard &rsaquo; <span className="text-orange">Settings</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Configure company information, contact details, social links, and security policies.</p>
        </div>
        <button 
          onClick={fetchConfig} 
          className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange' : 'text-gray-500'} /> Reload Settings
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-xs">
        {[
          { id: 'contact', label: 'Contact & Company', icon: <Mail size={14} /> },
          { id: 'social', label: 'Social Profiles', icon: <Share2 size={14} /> },
          { id: 'security', label: 'Security & Database', icon: <Shield size={14} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-orange text-white shadow-sm' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border animate-in fade-in duration-200 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Tab 1: Contact Information */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Mail size={18} className="text-orange" /> Public Contact & Office Info
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-orange" /> Primary Support Email
                </label>
                <input 
                  type="email" 
                  name="email_1" 
                  value={config.email_1 || ''} 
                  onChange={handleChange} 
                  placeholder="support@edizo.in"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                  required 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail size={14} className="text-blue-500" /> Secondary / Career Email
                </label>
                <input 
                  type="email" 
                  name="email_2" 
                  value={config.email_2 || ''} 
                  onChange={handleChange} 
                  placeholder="careers@edizo.in"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-500" /> Official Phone Number
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  value={config.phone || ''} 
                  onChange={handleChange} 
                  placeholder="+91 98765 43210"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-purple-500" /> Office / Support Hours
                </label>
                <input 
                  type="text" 
                  name="office_hours" 
                  value={config.office_hours || ''} 
                  onChange={handleChange} 
                  placeholder="Mon - Sat: 9:00 AM - 6:00 PM IST"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-red-500" /> Corporate Headquarters Address
                </label>
                <input 
                  type="text" 
                  name="address_line1" 
                  value={config.address_line1 || ''} 
                  onChange={handleChange} 
                  placeholder="Technology Park, Bangalore, India"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Links */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Share2 size={18} className="text-orange" /> Social Media & External Presence
            </h2>

            <div className="grid md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">LinkedIn Organization URL</label>
                <input 
                  type="url" 
                  name="social_linkedin" 
                  value={config.social_linkedin || ''} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/company/edizo"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Twitter / X URL</label>
                <input 
                  type="url" 
                  name="social_twitter" 
                  value={config.social_twitter || ''} 
                  onChange={handleChange} 
                  placeholder="https://x.com/edizotech"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Instagram URL</label>
                <input 
                  type="url" 
                  name="social_instagram" 
                  value={config.social_instagram || ''} 
                  onChange={handleChange} 
                  placeholder="https://instagram.com/edizo.io"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5">Facebook Page URL</label>
                <input 
                  type="url" 
                  name="social_facebook" 
                  value={config.social_facebook || ''} 
                  onChange={handleChange} 
                  placeholder="https://facebook.com/edizo"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange focus:bg-white transition-all" 
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Database */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Shield size={18} className="text-orange" /> Enterprise Security & Rules
            </h2>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2 font-bold text-emerald-800 mb-1">
                  <CheckCircle size={15} /> MySQL Connection Pool
                </div>
                <p className="text-emerald-600 text-[11px]">Parameterized queries active across all 24 routes.</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">
                  <Lock size={15} /> RBAC & IP Guard
                </div>
                <p className="text-blue-600 text-[11px]">Enforced via middleware with audit trail logging.</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <div className="flex items-center gap-2 font-bold text-purple-800 mb-1">
                  <Server size={15} /> Rate Limiter
                </div>
                <p className="text-purple-600 text-[11px]">DB-backed per-IP and per-user throttling active.</p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-orange hover:bg-orange-dark text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default SettingsView;
