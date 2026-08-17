import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, CheckCircle2, ShieldCheck, Clock, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InternshipApplication = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
    reason: ''
  });

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/internships/${id}`);
        if (!res.ok) throw new Error('Not found');
        const internship = await res.json();
        setData(internship);
      } catch (err) {
        console.error("Failed to fetch internship details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen bg-grey-light">
        <h1 className="text-4xl font-bold text-grey-dark">Internship not found</h1>
        <Link to="/internships" className="text-orange hover:underline mt-4 inline-block font-bold">Return to Internships</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const imgUrl = data.image && data.image !== '/images/internship.png'
    ? (data.image.startsWith('http') ? data.image : `${API_URL}${data.image}`) 
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to submit an application.");
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/users/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          internship_id: id,
          status: 'pending'
        })
      });

      if (!res.ok) throw new Error('Failed to submit application');
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-grey-light min-h-screen font-sans flex items-center justify-center py-20 px-4 md:px-6 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
      
      <div className="container mx-auto max-w-7xl relative z-10 pt-16">
        
        <Link to={`/internships/${id}`} className="inline-flex items-center text-grey-medium hover:text-orange mb-6 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to Details
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-grey-silver flex flex-col lg:flex-row min-h-[700px]"
        >
          
          {/* LEFT SIDE: Program Info (Navy) */}
          <div className="lg:w-[45%] bg-navy p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-between">
            {imgUrl && (
              <>
                <img src={imgUrl} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay z-0" />
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-navy/40 z-0"></div>
              </>
            )}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2 z-0" />
            
            <div className="relative z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange font-bold text-xs mb-6 uppercase tracking-wider backdrop-blur-sm">
                Edizo Academy
              </span>
              
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
                Apply for <span className="text-orange">{data.title}</span>
              </h1>
              
              <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
                Take the first step towards an accelerating career. Work on real products, learn from industry experts, and get certified.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-orange/20 rounded-xl flex items-center justify-center text-orange"><Clock size={20} /></div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Duration</p>
                    <p className="font-bold">{data.duration || 'Flexible'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><MapPin size={20} /></div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Mode</p>
                    <p className="font-bold">{data.mode || 'Remote'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400"><ShieldCheck size={20} /></div>
                  <div>
                    <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-1">Benefits</p>
                    <p className="font-bold">Certificate & PPO</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10 relative z-10 flex items-center justify-between">
               <div className="text-sm font-bold text-white/50 uppercase tracking-wider">Powered by</div>
               <div className="text-xl font-display font-bold tracking-widest text-white/80">EDIZO</div>
            </div>
          </div>

          {/* RIGHT SIDE: Application Form (White) */}
          <div className="lg:w-[55%] p-10 md:p-16 relative">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-100">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-grey-dark mb-4">Application Received!</h2>
                  <p className="text-grey-medium mb-10 max-w-md mx-auto leading-relaxed">
                    Thank you for applying. Our talent acquisition team will review your profile and reach out within 48 hours.
                  </p>
                  <Link to="/dashboard" className="px-8 py-4 bg-navy text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-orange transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-1">
                    View Application Status
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-grey-dark mb-2">Applicant Details</h2>
                    <p className="text-grey-medium">Ensure your contact information is accurate.</p>
                    {error && <p className="mt-4 text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input 
                          type="text" name="firstName" id="firstName" required 
                          className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver bg-grey-light text-grey-dark focus:bg-white focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer" 
                          placeholder=" "
                          onChange={handleInputChange}
                        />
                        <label htmlFor="firstName" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                          First Name
                        </label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" name="lastName" id="lastName" required 
                          className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver bg-grey-light text-grey-dark focus:bg-white focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer" 
                          placeholder=" "
                          onChange={handleInputChange}
                        />
                        <label htmlFor="lastName" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                          Last Name
                        </label>
                      </div>
                    </div>

                    <div className="relative group">
                      <input 
                        type="email" name="email" id="email" required 
                        className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver bg-grey-light text-grey-dark focus:bg-white focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer" 
                        placeholder=" "
                        onChange={handleInputChange}
                      />
                      <label htmlFor="email" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Email Address
                      </label>
                    </div>

                    <div className="relative group">
                      <input 
                        type="url" name="linkedin" id="linkedin" 
                        className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver bg-grey-light text-grey-dark focus:bg-white focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer" 
                        placeholder=" "
                        onChange={handleInputChange}
                      />
                      <label htmlFor="linkedin" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        LinkedIn Profile / Portfolio
                      </label>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-grey-dark block mb-2 px-1">Upload Resume (PDF)</label>
                      <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-grey-silver border-dashed rounded-2xl hover:border-orange hover:bg-orange/5 transition-colors cursor-pointer relative bg-grey-light group">
                        <div className="space-y-3 text-center">
                          <div className="w-16 h-16 bg-white border border-grey-silver rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:shadow-orange/20 transition-all">
                            <Upload className="h-6 w-6 text-orange" />
                          </div>
                          <div className="flex text-sm text-grey-dark justify-center">
                            <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-orange hover:text-orange-dark focus-within:outline-none">
                              <span>Click to upload</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                            </label>
                            <p className="pl-1 text-grey-medium">or drag and drop</p>
                          </div>
                          <p className="text-xs font-medium text-grey-medium">PDF up to 5MB</p>
                          {file && <p className="text-sm font-bold text-green-600 mt-4 bg-green-50 py-2 px-4 rounded-xl border border-green-200 shadow-sm">{file.name}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <textarea 
                        name="reason" id="reason" rows={4} required 
                        className="w-full px-5 pt-8 pb-4 rounded-2xl border border-grey-silver bg-grey-light text-grey-dark focus:bg-white focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer resize-none" 
                        placeholder=" "
                        onChange={handleInputChange}
                      ></textarea>
                      <label htmlFor="reason" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                        Why should we select you?
                      </label>
                    </div>

                    <button 
                      disabled={isSubmitting} 
                      type="submit" 
                      className="w-full py-5 bg-orange text-white font-bold rounded-2xl hover:bg-navy transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-8 text-lg disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-orange flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                           Submitting...
                        </>
                      ) : 'Submit Application'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipApplication;
