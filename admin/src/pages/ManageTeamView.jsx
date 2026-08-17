import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

const ManageTeamView = () => {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', linkedin_url: '', status: 'active', image_url: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const loadMembers = async () => {
    try {
      const data = await fetchApi('/api/team', {}, token);
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleEdit = (member) => {
    setEditId(member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      linkedin_url: member.linkedin_url || '',
      status: member.status || 'active',
      image_url: member.image_url || ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("File is too large. Attempting compression...");
      const compressedBase64 = await compressImage(file);
      setFormData({ ...formData, image_url: compressedBase64 });
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/team`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await res.json();
      if (data.image_url) {
        setFormData({ ...formData, image_url: data.image_url });
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image directly. Please save the form instead.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await fetchApi(`/api/team/${id}`, { method: 'DELETE' }, token);
      setSuccessMsg('Team member deleted!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await fetchApi(`/api/team/${editId}`, { method: 'PUT', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Team member updated!');
      } else {
        await fetchApi('/api/team', { method: 'POST', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Team member added!');
      }
      setTimeout(() => setSuccessMsg(''), 3000);
      setEditId(null);
      setFormData({ name: '', role: '', bio: '', linkedin_url: '', status: 'active', image_url: '' });
      loadMembers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Team...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Team</h1>
          <p className="text-gray-500 mt-1">Manage team members displayed on the About page.</p>
        </div>
      </div>
      
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 font-medium">
          <CheckCircle size={20} /> {successMsg}
        </motion.div>
      )}

      {/* Form */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{editId ? 'Edit Team Member' : 'Add New Team Member'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Role / Title</label>
            <input type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn URL</label>
            <input type="text" value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Profile Image</label>
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 cursor-pointer" />
              </div>
              {formData.image_url && (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={formData.image_url.startsWith('data:') ? formData.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.image_url}`} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          {editId && (
            <button onClick={() => { setEditId(null); setFormData({ name: '', role: '', bio: '', linkedin_url: '', status: 'active', image_url: '' }); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors">
            <Save size={20} /> {editId ? 'Update' : 'Add'} Member
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
              <th className="p-6 font-bold">Member</th>
              <th className="p-6 font-bold">Role</th>
              <th className="p-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                    {member.image_url ? (
                        <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${member.image_url}`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-orange/20 flex items-center justify-center text-orange font-bold">{member.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="font-bold text-gray-900">{member.name}</div>
                </td>
                <td className="p-6 text-sm text-gray-700">{member.role}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(member)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="p-8 text-center text-gray-500">No team members added yet.</div>
        )}
      </div>
    </div>
  );
};

export default ManageTeamView;
