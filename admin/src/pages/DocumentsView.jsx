import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Folder, FileText, Plus, Search, Download, 
  Eye, Trash2, Lock, Unlock, Tag, X
} from 'lucide-react';

export default function DocumentsView() {
  const { token } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New Document State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [fileUploadId, setFileUploadId] = useState(1);
  const [visibleToClient, setVisibleToClient] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resDocs, resCats] = await Promise.all([
        fetch(`${baseUrl}/api/documents`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${baseUrl}/api/documents/categories`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const dataDocs = await resDocs.json();
      const dataCats = await resCats.json();

      if (dataDocs.success) setDocuments(dataDocs.data || []);
      if (dataCats.success) {
        setCategories(dataCats.data || []);
        if (dataCats.data?.length > 0) setCategoryId(dataCats.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category_id: categoryId || null,
          file_upload_id: fileUploadId,
          visible_to_client: visibleToClient
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowUploadModal(false);
        setTitle('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save document:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this document record?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const filteredDocs = selectedCategory === 'all' 
    ? documents 
    : documents.filter(d => String(d.category_id) === String(selectedCategory));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Client & Project Document Center</h1>
          <p className="text-sm text-gray-500 mt-1">Catalog contracts, NDAs, project artifacts, and compliance files</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:bg-orange-dark transition-all"
        >
          <Plus size={16} /> Add Document
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedCategory === 'all' ? 'bg-orange text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Categories ({documents.length})
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id ? 'bg-orange text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange/10 text-orange flex items-center justify-center font-bold">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{doc.title}</h3>
                    <span className="text-[11px] text-gray-400 font-medium">{doc.category_name || 'General Document'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(doc.id)}
                  className="p-1 text-gray-300 hover:text-rose-500 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>File:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[160px]">{doc.original_name || 'Document File'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Client Visibility:</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    {doc.visible_to_client ? <Unlock size={12} /> : <Lock size={12} className="text-gray-400" />}
                    {doc.visible_to_client ? 'Client Visible' : 'Staff Only'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
              {doc.storage_path && (
                <a 
                  href={doc.storage_path} 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-bold text-orange hover:text-orange-dark flex items-center gap-1"
                >
                  <Download size={14} /> Download
                </a>
              )}
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && !loading && (
          <div className="col-span-full p-12 bg-white border border-dashed border-gray-200 rounded-2xl text-center text-xs text-gray-400">
            No documents cataloged in this category
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Document Record</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Document Title *</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Service Agreement & Non-Disclosure"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-orange focus:outline-none bg-white font-medium"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={visibleToClient}
                    onChange={(e) => setVisibleToClient(e.target.checked)}
                    className="rounded text-orange focus:ring-orange"
                  />
                  <span>Make visible on Client Portal dashboard</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-orange text-white font-bold rounded-xl shadow-lg shadow-orange/20 hover:bg-orange-dark"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
