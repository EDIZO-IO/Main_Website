import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditServiceView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [serviceForm, setServiceForm] = useState({ 
    title: '', category: 'Web Development', description: '', features: '', price: '', status: 'active', image_url: '' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/services/${id}`);
        const data = await res.json();
        
        // Convert array/json fields back to strings for textarea editing
        const featuresString = Array.isArray(data.features) 
          ? data.features.map(f => f.title || f).join('\n') 
          : typeof data.features === 'string' ? data.features : '';

        setServiceForm({
          ...data,
          features: featuresString
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/admin/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(serviceForm)
      });
      navigate('/services');
    } catch (error) {
      console.error(error);
    }
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

    // Compress image client-side to bypass Nginx 1MB payload limits
    const uploadFile = await compressImage(file);

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setServiceForm({ ...serviceForm, image_url: data.url });
      }
    } catch (err) {
      console.error('Image upload failed', err);
      alert('Failed to upload image.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="text-sm text-gray-500 mb-2">Dashboard &rsaquo; Services &rsaquo; <span className="text-orange font-medium">Edit Service</span></div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Edit Service</h1>
          <p className="text-gray-500">Update this enterprise service offering.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/services')} className="px-6 py-2 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleServiceSubmit} className="px-6 py-2 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-sm">
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange"><Briefcase size={16}/></div>
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Title</label>
              <input type="text" placeholder="e.g. Web Development" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none appearance-none">
                <option>Web Development</option>
                <option>Mobile App</option>
                <option>UI/UX Design</option>
                <option>AI & Machine Learning</option>
                <option>Cloud Solutions</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price (Optional)</label>
              <input type="text" placeholder="e.g. 50000 or Custom" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select value={serviceForm.status} onChange={e => setServiceForm({...serviceForm, status: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none appearance-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange"><Upload size={16}/></div>
            Service Image
          </h3>
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-orange/10 file:text-orange hover:file:bg-orange/20 cursor-pointer" />
              <p className="text-xs text-gray-500 mt-2">Recommended size: 800x600 pixels. Format: JPG, PNG, WEBP.</p>
            </div>
            {serviceForm.image_url && (
              <div className="w-48 h-32 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${serviceForm.image_url}`} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange"><FileText size={16}/></div>
            Overview & Features
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea rows="4" placeholder="Describe the service..." value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Features (One per line)</label>
            <textarea rows="4" placeholder="Scalable architecture&#10;24/7 Support&#10;Fast delivery" value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={handleServiceSubmit} className="px-8 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-md text-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceView;
