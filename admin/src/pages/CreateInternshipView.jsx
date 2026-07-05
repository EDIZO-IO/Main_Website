import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateInternshipView = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [internshipForm, setInternshipForm] = useState({ 
    title: '', category: 'Engineering', company: '', duration: '', mode: 'Remote', 
    description: '', syllabus: '', benefits: '', eligibility: '', status: 'active', stipend: '', price: '' 
  });

  const handleInternshipSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${baseUrl}/api/admin/internships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(internshipForm)
      });
      navigate('/internships');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="text-sm text-gray-500 mb-2">Dashboard &rsaquo; Internships &rsaquo; <span className="text-orange font-medium">Create New Internship</span></div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Create New Internship</h1>
          <p className="text-gray-500">Define a new learning path for ambitious developers and designers.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/internships')} className="px-6 py-2 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleInternshipSubmit} className="px-6 py-2 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-sm">
            Publish Internship
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
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Internship Title</label>
              <input type="text" placeholder="e.g. Senior Frontend Engineering Intern" value={internshipForm.title} onChange={e => setInternshipForm({...internshipForm, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select value={internshipForm.category} onChange={e => setInternshipForm({...internshipForm, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none appearance-none">
                <option>Engineering</option><option>Design</option><option>Marketing</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Work Mode</label>
              <div className="flex gap-2">
                {['Remote', 'On-site', 'Hybrid'].map(mode => (
                  <button key={mode} onClick={() => setInternshipForm({...internshipForm, mode})} className={`flex-1 py-3 border rounded-xl font-medium text-sm transition-colors ${internshipForm.mode === mode ? 'border-orange bg-orange/5 text-orange' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Months/Days)</label>
              <input type="text" placeholder="e.g. 6 Months" value={internshipForm.duration} onChange={e => setInternshipForm({...internshipForm, duration: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Stipend (Monthly)</label>
              <input type="text" placeholder="₹ 2,000" value={internshipForm.stipend} onChange={e => setInternshipForm({...internshipForm, stipend: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Program Fee (Price)</label>
              <input type="text" placeholder="0 for Free, or 5000" value={internshipForm.price} onChange={e => setInternshipForm({...internshipForm, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
          </div>
        </div>

        {/* Company Details */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange"><Upload size={16}/></div>
            Company Details
          </h3>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
              <input type="text" placeholder="Edizo, Tech Corp, etc." value={internshipForm.company} onChange={e => setInternshipForm({...internshipForm, company: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none" />
            </div>
          </div>
        </div>

        {/* Program Overview */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange"><FileText size={16}/></div>
            Program Overview
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">Internship Description</label>
            <textarea rows="4" placeholder="Describe the mission and scope of this internship..." value={internshipForm.description} onChange={e => setInternshipForm({...internshipForm, description: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none resize-none"></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Syllabus (What you'll do)</label>
            <textarea rows="3" placeholder="Bullet points of key responsibilities and impact..." value={internshipForm.syllabus} onChange={e => setInternshipForm({...internshipForm, syllabus: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 outline-none resize-none"></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button onClick={handleInternshipSubmit} className="px-8 py-3 bg-orange text-white rounded-xl font-bold hover:bg-orange-dark transition-colors shadow-md text-lg">
            Publish Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInternshipView;
