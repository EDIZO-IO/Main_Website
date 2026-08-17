import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, MapPin, DollarSign, ChevronDown, CheckCircle2, 
  Share2, Bookmark, GraduationCap, Briefcase, Award, Zap,
  ArrowLeft, ArrowRight, ShieldCheck, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InternshipDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const { isAuthenticated } = useAuth();

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

  if (!data) return null;

  const faqs = [
    "What is the selection process?",
    "Is this a paid internship?",
    "Can international students apply?"
  ];

  const safeParseArray = (item, defaultArr = []) => {
    if (Array.isArray(item)) return item;
    if (typeof item === 'string') {
      try {
        const parsed = JSON.parse(item);
        return Array.isArray(parsed) ? parsed : defaultArr;
      } catch(e) {
        return defaultArr;
      }
    }
    return defaultArr;
  };

  const parsedSyllabus = safeParseArray(data.syllabus, []);
  const parsedSkills = safeParseArray(data.skills, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const imageUrl = data.image ? (data.image.startsWith('http') ? data.image : `${API_URL}${data.image}`) : '/images/internship.png';

  return (
    <div className="bg-grey-light min-h-screen font-sans pb-24">
      
      {/* Dark Theme Hero Header */}
      <section className="bg-navy pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/internships" className="inline-flex items-center text-white/70 hover:text-white mb-10 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Internships
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {data.category && (
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold tracking-wider uppercase mb-6 shadow-md backdrop-blur-md">
                  {data.category}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                {data.title}
              </h1>
              
              <p className="text-xl text-white/70 mb-10 leading-relaxed max-w-xl">
                Kickstart your career with real-world experience, direct mentorship, and a clear path to employment.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to={isAuthenticated ? `/internships/${id}/apply` : `/login`} className="px-8 py-4 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-all shadow-lg shadow-orange/30 hover:-translate-y-1 flex items-center group">
                  {isAuthenticated ? "Apply for Internship" : "Login to Apply"}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="px-8 py-4 bg-white/5 text-white border border-white/20 font-bold rounded-full hover:bg-white/10 transition-all flex items-center backdrop-blur-sm">
                  <Bookmark size={18} className="mr-2" /> Save to Wishlist
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/80">
                <div className="flex items-center gap-2"><Briefcase size={16} className="text-orange" /> {data.company || "Edizo Academy"}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-orange" /> {data.mode || "Remote"}</div>
                <div className="flex items-center gap-2"><Clock size={16} className="text-orange" /> {data.duration || "Flexible"}</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange/20 to-transparent rounded-[3rem] transform translate-x-6 translate-y-6"></div>
              <img 
                src={imageUrl} 
                alt={data.title} 
                className="w-full h-auto object-cover rounded-[3rem] shadow-2xl relative z-10 border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 max-w-6xl -mt-10 relative z-20">
        
        {/* At a Glance Bar */}
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-grey-silver flex flex-wrap gap-6 justify-between items-center mb-12 backdrop-blur-md">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center text-orange"><DollarSign size={24} /></div>
             <div>
               <p className="text-xs text-grey-medium font-bold uppercase tracking-wider">Stipend</p>
               <p className="font-bold text-grey-dark text-lg">{data.stipend || 'Unpaid'}</p>
             </div>
           </div>
           <div className="hidden md:block w-px h-10 bg-grey-silver"></div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center text-navy"><Award size={24} /></div>
             <div>
               <p className="text-xs text-grey-medium font-bold uppercase tracking-wider">Program Fee</p>
               <p className="font-bold text-orange text-lg">{data.price === '0' || !data.price ? 'Free' : `₹${data.price}`}</p>
             </div>
           </div>
           <div className="hidden md:block w-px h-10 bg-grey-silver"></div>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500"><ShieldCheck size={24} /></div>
             <div>
               <p className="text-xs text-grey-medium font-bold uppercase tracking-wider">Certificate</p>
               <p className="font-bold text-grey-dark text-lg">Included</p>
             </div>
           </div>
           <div className="hidden lg:block w-px h-10 bg-grey-silver"></div>
           <div className="flex items-center gap-4 pr-4">
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Zap size={24} /></div>
             <div>
               <p className="text-xs text-grey-medium font-bold uppercase tracking-wider">Pre-Placement</p>
               <p className="font-bold text-grey-dark text-lg">PPO Offered</p>
             </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Left Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Program Overview</h2>
              </div>
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-grey-silver space-y-4 text-grey-medium leading-relaxed whitespace-pre-wrap text-lg">
                {data.description}
              </div>
            </section>

            {parsedSyllabus.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                  <h2 className="text-2xl font-bold text-grey-dark">Syllabus & Journey</h2>
                </div>
                
                <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange/30 before:to-transparent">
                  {parsedSyllabus.map((mod, i) => (
                  <div key={i} className="relative bg-white p-8 rounded-[2.5rem] shadow-sm border border-grey-silver group hover:border-orange/30 transition-colors">
                    <div className="absolute left-[-41px] top-8 w-4 h-4 rounded-full bg-orange border-4 border-white shadow-sm group-hover:scale-125 transition-transform"></div>
                    <span className="text-xs font-bold text-orange uppercase tracking-wider mb-2 block">
                      Phase {i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-grey-dark mb-3">{mod.title || mod}</h3>
                    <p className="text-grey-medium leading-relaxed">{mod.desc || "Dive deep into core concepts and hands-on execution."}</p>
                  </div>
                ))}
              </div>
            </section>
            )}

            {parsedSkills.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Skills You'll Master</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {parsedSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-grey-silver shadow-sm font-bold text-grey-dark hover:border-orange/30 hover:text-orange transition-colors cursor-default">
                    <Zap className="text-orange" size={18} /> {skill}
                  </div>
                ))}
              </div>
            </section>
            )}

            {/* Perks & Benefits */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Perks & Benefits</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Briefcase />, title: "1:1 Mentorship", desc: "Weekly syncs with senior staff engineers." },
                  { icon: <Award />, title: "Performance Bonus", desc: "Quarterly bonuses based on contribution impact." },
                  { icon: <CheckCircle2 />, title: "PPO Opportunity", desc: "Top-tier interns receive pre-placement offers." },
                  { icon: <GraduationCap />, title: "Letter of Rec", desc: "Personalized LOR upon successful completion." }
                ].map((perk, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-grey-silver flex gap-4 hover:shadow-md transition-shadow">
                    <div className="text-orange shrink-0">{perk.icon}</div>
                    <div>
                      <h4 className="font-bold text-grey-dark mb-1">{perk.title}</h4>
                      <p className="text-sm text-grey-medium">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Apply Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-grey-silver">
                <div className="flex justify-between items-center mb-6 border-b border-grey-silver pb-6">
                  <h3 className="text-xl font-bold text-grey-dark">Enrollment</h3>
                  <span className="px-3 py-1 bg-green-50 text-green-600 font-bold text-xs rounded-full flex items-center gap-1 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Open Now
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-grey-medium">Available Seats</span>
                  <span className="text-sm font-bold text-grey-dark">12 left</span>
                </div>
                <div className="w-full h-2 bg-grey-light rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange to-orange-dark w-[65%] rounded-full"></div>
                </div>

                {isAuthenticated ? (
                  <Link 
                    to={`/internships/${id}/apply`}
                    className="block w-full py-4 text-center bg-orange text-white font-bold rounded-2xl hover:bg-orange-dark transition-all shadow-lg shadow-orange/20 hover:-translate-y-0.5 active:translate-y-0 mb-3"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <Link 
                    to={`/login`}
                    className="block w-full py-4 text-center bg-navy text-white font-bold rounded-2xl hover:bg-black transition-all mb-3"
                  >
                    Login to Apply
                  </Link>
                )}
                
                <div className="mt-8 pt-8 border-t border-grey-silver">
                  <p className="text-xs font-bold text-grey-medium uppercase tracking-wider mb-4 text-center">Batch Starts In</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-grey-light border border-grey-silver rounded-xl p-2">
                      <div className="text-lg font-bold text-grey-dark">03</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase mt-1">Days</div>
                    </div>
                    <div className="bg-grey-light border border-grey-silver rounded-xl p-2">
                      <div className="text-lg font-bold text-grey-dark">12</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase mt-1">Hrs</div>
                    </div>
                    <div className="bg-grey-light border border-grey-silver rounded-xl p-2">
                      <div className="text-lg font-bold text-grey-dark">22</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase mt-1">Min</div>
                    </div>
                    <div className="bg-orange/10 border border-orange/20 rounded-xl p-2">
                      <div className="text-lg font-bold text-orange">43</div>
                      <div className="text-[10px] font-bold text-orange uppercase mt-1">Sec</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-sm font-bold text-grey-medium">Share this program</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-white shadow-sm border border-grey-silver rounded-full flex items-center justify-center text-grey-medium hover:text-orange hover:border-orange/30 transition-colors"><Share2 size={16} /></button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
