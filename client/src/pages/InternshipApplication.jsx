import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, ShieldCheck, Clock, MapPin, Briefcase, GraduationCap, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  { label: 'Personal', icon: Briefcase },
  { label: 'Academic', icon: GraduationCap },
  { label: 'Cover Letter', icon: FileText },
];

const InternshipApplication = () => {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    degree: '',
    college: '',
    graduationYear: '',
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

  const handleNext = () => {
    setError('');
    if (step === 0) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all required fields.'); return;
      }
    } else if (step === 1) {
      if (!formData.degree || !formData.college) {
        setError('Please fill in your academic details.'); return;
      }
    }
    setStep(s => s + 1);
  };

  const handleBack = () => { setError(''); setStep(s => s - 1); };

  return (
    <div className="bg-[#F8F9FA] dark:bg-[#050B14] min-h-screen font-sans flex items-center justify-center py-20 px-4 md:px-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />
      
      <div className="container mx-auto max-w-7xl relative z-10 pt-16">
        
        <Link to={`/internships/${id}`} className="inline-flex items-center text-grey-medium dark:text-white/60 hover:text-orange mb-6 transition-colors font-bold uppercase tracking-wider text-sm">
          <ArrowLeft size={18} className="mr-2" /> Back to Details
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white dark:bg-[#0B132B] rounded-[3rem] overflow-hidden shadow-2xl border border-grey-silver dark:border-white/10 flex flex-col lg:flex-row min-h-[700px]"
        >
          
          {/* LEFT SIDE: Program Info (Navy) */}
          <div className="lg:w-[45%] bg-[#070F26] p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            {imgUrl && (
              <>
                <img src={imgUrl} alt={data.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay z-0" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#070F26] via-[#070F26]/80 to-[#070F26]/40 z-0"></div>
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

          {/* RIGHT SIDE: Application Form */}
          <div className="lg:w-[55%] p-10 md:p-16 relative bg-white dark:bg-[#0B132B]">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-24 h-24 bg-green-50 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-200 dark:border-green-800">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-grey-dark dark:text-white mb-4">Application Received!</h2>
                  <p className="text-grey-medium dark:text-white/70 mb-10 max-w-md mx-auto leading-relaxed">
                    Thank you for applying. Our talent acquisition team will review your profile and reach out within 48 hours.
                  </p>
                  <Link to="/dashboard" className="px-8 py-4 bg-[#0B132B] dark:bg-white text-white dark:text-[#0B132B] font-bold uppercase tracking-wider text-sm rounded-full hover:bg-orange dark:hover:bg-orange dark:hover:text-white transition-all shadow-lg hover:-translate-y-1">
                    View Application Status
                  </Link>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Stepper */}
                  <div className="mb-8">
                    <div className="flex items-center gap-0">
                      {STEPS.map((s, i) => (
                        <div key={s.label} className="flex items-center flex-1">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                            i < step ? 'text-green-600 dark:text-green-400' : i === step ? 'text-orange' : 'text-grey-medium dark:text-white/50'
                          }`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                              i < step ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' : i === step ? 'bg-orange text-white shadow-sm shadow-orange/30' : 'bg-grey-light dark:bg-[#060B13] text-grey-medium dark:text-white/50 border border-grey-silver dark:border-white/10'
                            }`}>
                              {i < step ? <CheckCircle2 size={14} /> : i + 1}
                            </div>
                            <span className="hidden sm:inline">{s.label}</span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-1 rounded transition-all ${i < step ? 'bg-green-300 dark:bg-green-700' : 'bg-grey-silver dark:bg-white/10'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-grey-light dark:bg-[#060B13] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-orange to-orange-dark rounded-full"
                        animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <p className="text-xs text-grey-medium dark:text-white/60 mt-2 font-medium">Step {step + 1} of {STEPS.length}</p>
                  </div>

                  {error && <p className="mb-4 text-red-500 font-bold bg-red-50 dark:bg-red-950/50 p-3 rounded-xl border border-red-200 dark:border-red-900 text-sm">{error}</p>}

                  <AnimatePresence mode="wait">
                    {step === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <h3 className="text-xl font-bold text-grey-dark dark:text-white mb-4">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="relative group">
                            <input type="text" name="firstName" id="app-firstName" required
                              className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                              placeholder=" " value={formData.firstName} onChange={handleInputChange} />
                            <label htmlFor="app-firstName" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">First Name *</label>
                          </div>
                          <div className="relative group">
                            <input type="text" name="lastName" id="app-lastName" required
                              className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                              placeholder=" " value={formData.lastName} onChange={handleInputChange} />
                            <label htmlFor="app-lastName" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">Last Name *</label>
                          </div>
                        </div>
                        <div className="relative group">
                          <input type="email" name="email" id="app-email" required
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.email} onChange={handleInputChange} />
                          <label htmlFor="app-email" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">Email Address *</label>
                        </div>
                        <div className="relative group">
                          <input type="tel" name="phone" id="app-phone"
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.phone} onChange={handleInputChange} />
                          <label htmlFor="app-phone" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">Phone Number</label>
                        </div>
                        <button type="button" onClick={handleNext} className="w-full py-4 bg-orange text-white font-bold rounded-2xl hover:bg-orange-dark transition-all shadow-lg flex items-center justify-center gap-2">
                          Continue <ArrowRight size={18} />
                        </button>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                        <h3 className="text-xl font-bold text-grey-dark dark:text-white mb-4">Academic Background</h3>
                        <div className="relative group">
                          <input type="text" name="degree" id="app-degree" required
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.degree} onChange={handleInputChange} />
                          <label htmlFor="app-degree" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">Degree / Program *</label>
                        </div>
                        <div className="relative group">
                          <input type="text" name="college" id="app-college" required
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.college} onChange={handleInputChange} />
                          <label htmlFor="app-college" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">College / University *</label>
                        </div>
                        <div className="relative group">
                          <input type="text" name="graduationYear" id="app-gradYear"
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.graduationYear} onChange={handleInputChange} />
                          <label htmlFor="app-gradYear" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">Expected Graduation Year</label>
                        </div>
                        <div className="relative group">
                          <input type="url" name="linkedin" id="app-linkedin"
                            className="w-full px-5 pt-6 pb-2 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer"
                            placeholder=" " value={formData.linkedin} onChange={handleInputChange} />
                          <label htmlFor="app-linkedin" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">LinkedIn / Portfolio URL</label>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" onClick={handleBack} className="flex-1 py-4 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white font-bold rounded-2xl border border-grey-silver dark:border-white/10 hover:bg-grey-silver dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                            <ArrowLeft size={18} /> Back
                          </button>
                          <button type="button" onClick={handleNext} className="flex-1 py-4 bg-orange text-white font-bold rounded-2xl hover:bg-orange-dark transition-all shadow-lg flex items-center justify-center gap-2">
                            Continue <ArrowRight size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <h3 className="text-xl font-bold text-grey-dark dark:text-white mb-4">Cover Letter & Resume</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                          <div className="relative group">
                            <textarea name="reason" id="app-reason" rows={5} required
                              className="w-full px-5 pt-8 pb-4 rounded-2xl border border-grey-silver dark:border-white/15 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white focus:bg-white dark:focus:bg-[#060B13] focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all peer resize-none"
                              placeholder=" " value={formData.reason} onChange={handleInputChange} />
                            <label htmlFor="app-reason" className="absolute text-sm font-bold text-grey-medium dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                              Why should we select you? *
                            </label>
                          </div>

                          <div>
                            <label className="text-sm font-bold text-grey-dark dark:text-white block mb-2 px-1">Upload Resume (PDF)</label>
                            <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-grey-silver dark:border-white/15 border-dashed rounded-2xl hover:border-orange hover:bg-orange/5 transition-colors cursor-pointer relative bg-grey-light dark:bg-[#060B13] group">
                              <div className="space-y-3 text-center">
                                <div className="w-16 h-16 bg-white dark:bg-white/10 border border-grey-silver dark:border-white/10 rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:shadow-orange/20 transition-all">
                                  <Upload className="h-6 w-6 text-orange" />
                                </div>
                                <div className="flex text-sm text-grey-dark dark:text-white justify-center">
                                  <label className="relative cursor-pointer font-bold text-orange hover:text-orange-dark">
                                    <span>Click to upload</span>
                                    <input id="app-file" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
                                  </label>
                                  <p className="pl-1 text-grey-medium dark:text-white/60">or drag and drop</p>
                                </div>
                                <p className="text-xs font-medium text-grey-medium dark:text-white/50">PDF up to 5MB</p>
                                {file && <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-2 bg-green-50 dark:bg-green-950/50 py-2 px-4 rounded-xl border border-green-200 dark:border-green-800">{file.name}</p>}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button type="button" onClick={handleBack} className="flex-1 py-4 bg-grey-light dark:bg-[#060B13] text-grey-dark dark:text-white font-bold rounded-2xl border border-grey-silver dark:border-white/10 hover:bg-grey-silver dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                              <ArrowLeft size={18} /> Back
                            </button>
                            <button type="submit" disabled={isSubmitting}
                              className="flex-1 py-4 bg-orange text-white font-bold rounded-2xl hover:bg-orange-dark transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                              {isSubmitting ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                              ) : 'Submit Application'}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
