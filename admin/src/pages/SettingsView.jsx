import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin, Save, Clock, Link as LinkIcon } from 'lucide-react';

const SettingsView = () => {
  const { token } = useAuth();
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
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
    };
    fetchConfig();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while saving.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8">Loading Settings...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">System Settings</h1>
        <p className="text-gray-500">Manage contact information and social links displayed on the public website.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {message && (
          <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Contact Info Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Contact Configuration</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Mail size={16}/> Primary Email</label>
                <input type="email" name="email_1" value={config.email_1} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Mail size={16}/> Secondary Email</label>
                <input type="email" name="email_2" value={config.email_2 || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Phone size={16}/> Phone Number</label>
                <input type="text" name="phone" value={config.phone} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Clock size={16}/> Office Hours</label>
                <input type="text" name="office_hours" value={config.office_hours} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={18}/> Headquarters Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Building / Location Name</label>
                  <input type="text" name="address_title" value={config.address_title} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 1</label>
                    <input type="text" name="address_line1" value={config.address_line1} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 2 (City, State, ZIP)</label>
                    <input type="text" name="address_line2" value={config.address_line2} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" required />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Social Media Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><LinkIcon size={16} className="text-[#0A66C2]" /> LinkedIn URL</label>
              <input type="url" name="social_linkedin" value={config.social_linkedin} onChange={handleChange} placeholder="https://linkedin.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><LinkIcon size={16} className="text-[#1DA1F2]" /> Twitter URL</label>
              <input type="url" name="social_twitter" value={config.social_twitter} onChange={handleChange} placeholder="https://twitter.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><LinkIcon size={16} className="text-[#E1306C]" /> Instagram URL</label>
              <input type="url" name="social_instagram" value={config.social_instagram} onChange={handleChange} placeholder="https://instagram.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><LinkIcon size={16} className="text-[#1877F2]" /> Facebook URL</label>
              <input type="url" name="social_facebook" value={config.social_facebook} onChange={handleChange} placeholder="https://facebook.com/..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pb-12">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-10 py-4 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-lg shadow-orange/20 disabled:opacity-50 text-lg">
            <Save size={20} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsView;
