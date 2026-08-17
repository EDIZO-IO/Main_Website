import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle, Save, Upload } from 'lucide-react';
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

const ManagePortfolioView = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    description: '',
    image_url: '',
    color: 'bg-blue-500'
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchApi('/api/portfolio', {}, token);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (proj) => {
    setEditId(proj.id);
    setFormData({
      title: proj.title,
      client: proj.client,
      category: proj.category,
      description: proj.description,
      image_url: proj.image_url || '',
      color: proj.color || 'bg-blue-500'
    });
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
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1200;
          
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFile = await compressImage(file);

    const uploadData = new FormData();
    uploadData.append('file', uploadFile);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image_url: data.url });
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image.');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await fetchApi(`/api/portfolio/${id}`, { method: 'DELETE' }, token);
      setSuccessMsg('Project deleted!');
      setTimeout(() => setSuccessMsg(''), 3000);
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await fetchApi(`/api/portfolio/${editId}`, { method: 'PUT', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Project updated!');
      } else {
        await fetchApi('/api/portfolio', { method: 'POST', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Project created!');
      }
      setTimeout(() => setSuccessMsg(''), 3000);
      setEditId(null);
      setFormData({ title: '', client: '', category: '', description: '', image_url: '', color: 'bg-blue-500' });
      loadProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading Portfolio...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Portfolio</h1>
          <p className="text-gray-500 mt-1">Manage public projects shown on the Projects page.</p>
        </div>
      </div>
      
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3 font-medium">
          <CheckCircle size={20} /> {successMsg}
        </motion.div>
      )}

      {/* Form */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{editId ? 'Edit Project' : 'Add New Project'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Client</label>
            <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Color (Tailwind bg class, e.g. bg-blue-500, bg-orange)</label>
            <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Project Image</label>
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 cursor-pointer" />
              </div>
              {formData.image_url && (
                <div className="w-32 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.image_url}`} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          {editId && (
            <button onClick={() => { setEditId(null); setFormData({ title: '', client: '', category: '', description: '', image_url: '', color: 'bg-blue-500' }); }} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          )}
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors">
            <Save size={20} /> {editId ? 'Update' : 'Create'} Project
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
              <th className="p-6 font-bold">Project</th>
              <th className="p-6 font-bold">Category</th>
              <th className="p-6 font-bold">Color</th>
              <th className="p-6 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-gray-900">{proj.title}</div>
                  <div className="text-sm text-gray-500">{proj.client}</div>
                </td>
                <td className="p-6 text-sm text-gray-700">{proj.category}</td>
                <td className="p-6">
                  <div className={`w-8 h-8 rounded-full ${proj.color}`}></div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(proj)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(proj.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="p-8 text-center text-gray-500">No projects found.</div>
        )}
      </div>
    </div>
  );
};

export default ManagePortfolioView;
