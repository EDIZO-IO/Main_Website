import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle, Save, Upload, Search, Briefcase, Filter, Grid, List, X, Layers, ExternalLink, Image as ImageIcon } from 'lucide-react';
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
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'API Request failed');
  }
  return res.json();
};

const ManagePortfolioView = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: '',
    service_id: '',
    description: '',
    image_url: '',
    color: 'bg-navy'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [projData, servData] = await Promise.all([
        fetchApi('/api/portfolio', {}, token).catch(() => []),
        fetchApi('/api/services', {}, token).catch(() => [])
      ]);
      setProjects(Array.isArray(projData) ? projData : []);
      setServices(Array.isArray(servData) ? servData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await fetchApi('/api/portfolio', {}, token);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      title: '',
      client: '',
      category: '',
      service_id: services.length > 0 ? services[0].id : '',
      description: '',
      image_url: '',
      color: 'bg-navy'
    });
    setIsModalOpen(true);
  };

  const handleEdit = (proj) => {
    setEditId(proj.id);
    setFormData({
      title: proj.title || '',
      client: proj.client || '',
      category: proj.category || '',
      service_id: proj.service_id || '',
      description: proj.description || '',
      image_url: proj.image_url || '',
      color: proj.color || 'bg-navy'
    });
    setIsModalOpen(true);
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

    try {
      const uploadFile = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append('file', uploadFile);

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
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetchApi(`/api/portfolio/${id}`, { method: 'DELETE' }, token);
      setSuccessMsg('Project deleted successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
      loadProjects();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to delete project.');
      setTimeout(() => setErrorMsg(''), 3500);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Please enter a project title.");
      return;
    }
    try {
      if (editId) {
        await fetchApi(`/api/portfolio/${editId}`, { method: 'PUT', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Project updated successfully!');
      } else {
        await fetchApi('/api/portfolio', { method: 'POST', body: JSON.stringify(formData) }, token);
        setSuccessMsg('Project created successfully!');
      }
      setTimeout(() => setSuccessMsg(''), 3500);
      setIsModalOpen(false);
      setEditId(null);
      loadProjects();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save project.');
      setTimeout(() => setErrorMsg(''), 3500);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedServiceFilter === 'all' || String(p.service_id) === String(selectedServiceFilter);
    return matchesSearch && matchesService;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange border-t-transparent mb-4"></div>
        <p className="font-medium">Loading Portfolio Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-gray-500 mb-1">Dashboard &rsaquo; Content &rsaquo; <span className="text-orange font-medium">Portfolio Showcase</span></div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Project Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">Manage public client projects displayed on the EDIZO website, categorized by service line.</p>
        </div>

        <button 
          onClick={handleOpenAdd} 
          className="flex items-center gap-2 px-6 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-all shadow-md hover:shadow-lg shadow-orange/20 shrink-0"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange/10 rounded-xl text-orange"><Briefcase size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Projects</p>
            <h3 className="text-2xl font-bold font-display text-gray-900">{projects.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Layers size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Services Linked</p>
            <h3 className="text-2xl font-bold font-display text-gray-900">{services.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Web Showcase</p>
            <h3 className="text-2xl font-bold font-display text-gray-900">{projects.filter(p => p.status === 'active' || !p.status).length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><ImageIcon size={24} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">With Visual Media</p>
            <h3 className="text-2xl font-bold font-display text-gray-900">{projects.filter(p => p.image_url).length}</h3>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-3 font-medium">
          <CheckCircle size={20} /> {successMsg}
        </motion.div>
      )}

      {errorMsg && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-3 font-medium">
          <X size={20} /> {errorMsg}
        </motion.div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search projects by title, client, or tag..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-1 rounded-xl">
            <button 
              onClick={() => setSelectedServiceFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedServiceFilter === 'all' ? 'bg-white text-orange shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All Services
            </button>
            {services.map(s => (
              <button 
                key={s.id}
                onClick={() => setSelectedServiceFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${String(selectedServiceFilter) === String(s.id) ? 'bg-white text-orange shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white text-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <motion.div 
              key={proj.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-gray-100 overflow-hidden border-b border-gray-100">
                  {proj.image_url ? (
                    <img 
                      src={proj.image_url.startsWith('http') ? proj.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${proj.image_url}`} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                      <ImageIcon size={36} className="mb-2 opacity-50" />
                      <span className="text-xs font-medium">No Thumbnail Image</span>
                    </div>
                  )}
                  {proj.service_title && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-navy/90 text-white backdrop-blur-md rounded-full text-xs font-bold border border-white/10 shadow-sm">
                      {proj.service_title}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-display text-gray-900">{proj.title}</h3>
                  </div>
                  {proj.client && <p className="text-xs font-bold text-orange uppercase tracking-wider mb-3">Client: {proj.client}</p>}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{proj.description || 'No detailed description specified.'}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-200/60 text-gray-700">
                  {proj.category || 'General Tag'}
                </span>

                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleEdit(proj)} 
                    className="p-2 text-gray-500 hover:text-orange hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Edit Project"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(proj.id)} 
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
              <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">No Projects Found</h3>
              <p className="text-sm text-gray-500 mb-4">No portfolio items match your filter criteria or search query.</p>
              <button onClick={handleOpenAdd} className="px-5 py-2.5 bg-orange text-white rounded-xl font-bold text-sm hover:bg-orange-dark transition-colors">
                Add First Project
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs tracking-wider">
                <th className="p-4 font-bold">Project Details</th>
                <th className="p-4 font-bold">Client Name</th>
                <th className="p-4 font-bold">Associated Service</th>
                <th className="p-4 font-bold">Category Tag</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {proj.image_url ? (
                        <img 
                          src={proj.image_url.startsWith('http') ? proj.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${proj.image_url}`} 
                          className="w-12 h-10 rounded-lg object-cover border border-gray-200 shrink-0" 
                        />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-gray-400">
                          <ImageIcon size={18} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-900">{proj.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{proj.description || 'No description'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">{proj.client || '-'}</td>
                  <td className="p-4 text-sm">
                    {proj.service_title ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {proj.service_title}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-normal text-xs">Unlinked</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{proj.category || '-'}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(proj)} className="p-2 text-gray-400 hover:text-orange hover:bg-orange/10 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(proj.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No projects found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal / Drawer for Add & Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden my-8"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold font-display text-gray-900">{editId ? 'Edit Showcase Project' : 'Add Showcase Project'}</h2>
                  <p className="text-xs text-gray-500">Add client work to feature on the EDIZO public website.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/50">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Project Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. EduPortal Learning Hub"
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-sm font-medium" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Client / Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. AgriTech Solutions"
                      value={formData.client} 
                      onChange={e => setFormData({...formData, client: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-sm font-medium" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Category Tag Badge</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mobile Application"
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-sm font-medium" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Associated Service Line (Splits website portfolio tabs)</label>
                  <select
                    value={formData.service_id}
                    onChange={e => setFormData({...formData, service_id: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-sm font-medium"
                  >
                    <option value="">-- General Project (No specific service link) --</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.category || 'Service'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Project Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Describe the solution built, tech stack used, and overall business impact..."
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange text-sm font-medium resize-none" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Project Thumbnail Media</label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 cursor-pointer" 
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Recommended size: 800x600 px. Max file size: 2MB.</p>
                    </div>

                    {formData.image_url && (
                      <div className="w-24 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        <img 
                          src={formData.image_url.startsWith('http') ? formData.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${formData.image_url}`} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange text-white rounded-xl text-sm font-bold hover:bg-orange-dark transition-colors shadow-md shadow-orange/20"
                  >
                    <Save size={16} /> {editId ? 'Save Changes' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManagePortfolioView;
