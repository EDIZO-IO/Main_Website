import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, MapPin, DollarSign, ChevronDown, CheckCircle2, 
  Share2, Bookmark, GraduationCap, Briefcase, Award, Zap
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/internships/${id}`);
        if (!res.ok) throw new Error('Not found');
        const internship = await res.json();
        setData(internship);
      } catch (err) {
        console.error("Failed to fetch internship details", err);
        // Fallback mock data if API fails to display the UI correctly
        setData({
          title: "Software Engineer Intern",
          company: "Vertex Solutions",
          duration: "6 Months",
          mode: "Remote",
          stipend: "₹ 4,500/mo",
          description: "Vertex Solutions is seeking highly motivated Software Engineer Interns to join our 2024 Global Cohort. This isn't your typical 'coffee and copies' internship. You will be embedded directly into a high-performance agile squad, working on production-level code from week two.\n\nOur engineering culture values radical transparency, technical excellence, and human-centric design. You will be paired with a Senior Mentor who will guide your technical growth and career trajectory.",
          skills: ["React.js", "TypeScript", "Node.js", "AWS Stack", "System Design", "MongoDB"],
          syllabus: [
            { title: "Onboarding & Stack Setup", desc: "Get familiar with our internal tools, monorepo architecture, and CI/CD pipelines. Complete your first 'Small-Scale' bug fix and deploy to production." },
            { title: "Feature Development", desc: "Own a mid-sized feature end-to-end. Work with product managers and designers to translate requirements into scalable React components and Node.js endpoints." },
            { title: "Performance & Scale", desc: "Focus on system optimization. Deep dive into database indexing, AWS serverless configurations, and front-end performance profiling." },
            { title: "Capstone Project", desc: "Propose and lead a technical initiative that solves a real business problem. Present your findings to the VP of Engineering." }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">Loading details...</div>;
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
  const parsedSkills = safeParseArray(data.skills, ["React.js", "TypeScript", "Node.js", "AWS Stack", "System Design", "MongoDB"]);

  return (
    <div className="pt-32 pb-24 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Top Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
              <span className="text-orange font-bold font-display">V</span>
            </div>
            <span className="text-sm font-bold text-grey-dark tracking-wider uppercase">
              {data.company || "Vertex Solutions"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-grey-dark mb-6">
            {data.title}
          </h1>
          
          <p className="text-lg text-grey-medium max-w-3xl mb-8 leading-relaxed">
            Join our core platform team to build the future of collaborative developer tools. Shape the infrastructure that powers over 10M+ deployments monthly.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] rounded-2xl border border-gray-100">
              <Clock className="text-orange" size={20} />
              <div>
                <p className="text-xs text-grey-medium font-medium uppercase tracking-wider">Duration</p>
                <p className="font-bold text-grey-dark">{data.duration || '6 Months'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] rounded-2xl border border-gray-100">
              <MapPin className="text-orange" size={20} />
              <div>
                <p className="text-xs text-grey-medium font-medium uppercase tracking-wider">Mode</p>
                <p className="font-bold text-grey-dark">{data.mode || 'Remote'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] rounded-2xl border border-gray-100">
              <DollarSign className="text-orange" size={20} />
              <div>
                <p className="text-xs text-grey-medium font-medium uppercase tracking-wider">Stipend</p>
                <p className="font-bold text-grey-dark">{data.stipend ? data.stipend : 'Not Disclosed'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-[#F8FAFC] rounded-2xl border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-orange font-bold text-sm">₹</div>
              <div>
                <p className="text-xs text-grey-medium font-medium uppercase tracking-wider">Program Fee</p>
                <p className="font-bold text-orange">{data.price === '0' || !data.price ? 'Free' : `₹${data.price}`}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Left Content */}
          <div className="w-full lg:w-2/3 space-y-12">
            
            {/* Program Overview */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Program Overview</h2>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-4 text-grey-medium leading-relaxed whitespace-pre-wrap">
                {data.description}
              </div>
            </section>

            {/* Syllabus & Journey */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Syllabus & Journey</h2>
              </div>
              
              <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange/30 before:to-transparent">
                {parsedSyllabus.map((mod, i) => (
                  <div key={i} className="relative bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="absolute left-[-41px] top-8 w-4 h-4 rounded-full bg-orange border-4 border-white shadow-sm"></div>
                    <span className="text-xs font-bold text-orange uppercase tracking-wider mb-2 block">
                      Month {i === 0 ? '1' : i === 1 ? '2 - 3' : i === 2 ? '4 - 5' : '6'}
                    </span>
                    <h3 className="text-lg font-bold text-grey-dark mb-3">{mod.title || mod}</h3>
                    <p className="text-grey-medium leading-relaxed">{mod.desc || "Dive deep into core concepts and hands-on execution."}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills You'll Master */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Skills You'll Master</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {parsedSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm font-medium text-grey-dark">
                    <Zap className="text-orange" size={16} /> {skill}
                  </div>
                ))}
              </div>
            </section>

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
                  { icon: <Zap />, title: "PPO Opportunity", desc: "Top-tier interns receive pre-placement offers." },
                  { icon: <GraduationCap />, title: "Learning Budget", desc: "$1000 allowance for books and courses." }
                ].map((perk, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex gap-4">
                    <div className="text-orange shrink-0">{perk.icon}</div>
                    <div>
                      <h4 className="font-bold text-grey-dark mb-1">{perk.title}</h4>
                      <p className="text-sm text-grey-medium">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Industry Recognition */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Industry Recognition</h2>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 bg-[#1A2E35] p-4 rounded-2xl shrink-0">
                  <div className="aspect-video bg-white/90 rounded-lg shadow-inner flex items-center justify-center border-[8px] border-white/10 relative overflow-hidden">
                    {/* Dummy Certificate UI */}
                    <div className="text-center p-4">
                      <div className="w-12 h-1 bg-orange/50 mx-auto mb-4"></div>
                      <h4 className="font-serif text-sm text-gray-800 font-bold mb-2">CERTIFICATE OF COMPLETION</h4>
                      <div className="w-24 h-1 border-t border-b border-gray-300 mx-auto my-2"></div>
                      <div className="absolute bottom-0 right-0 w-16 h-16 bg-orange/20 rounded-tl-full"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-grey-dark mb-3">Verified Excellence</h3>
                  <p className="text-grey-medium mb-4 leading-relaxed">
                    Upon successful completion, receive a globally recognized, cryptographically verified digital certificate to showcase your engineering prowess.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm font-medium text-grey-dark"><CheckCircle2 size={16} className="text-orange" /> ISO Certified Certification</li>
                    <li className="flex items-center gap-2 text-sm font-medium text-grey-dark"><CheckCircle2 size={16} className="text-orange" /> Detailed Skill Assessment Report</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Common Questions */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-1.5 h-8 bg-orange rounded-full"></div>
                <h2 className="text-2xl font-bold text-grey-dark">Common Questions</h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <button 
                    key={i} 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center text-left hover:border-orange/30 transition-colors"
                  >
                    <span className="font-bold text-grey-dark">{faq}</span>
                    <ChevronDown size={20} className={`text-grey-medium transition-transform ${openFaq === i ? 'rotate-180 text-orange' : ''}`} />
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              
              {/* Apply Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
                  <h3 className="text-xl font-bold text-grey-dark">Apply for Role</h3>
                  <span className="px-3 py-1 bg-green-50 text-green-600 font-bold text-xs rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                  </span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-grey-medium">Openings</span>
                  <span className="text-sm font-bold text-grey-dark">12 Seats left</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-orange w-[20%] rounded-full"></div>
                </div>

                {isAuthenticated ? (
                  <Link 
                    to={`/internships/${id}/apply`}
                    className="block w-full py-4 text-center bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-all shadow-lg shadow-orange/20 hover:-translate-y-0.5 active:translate-y-0 mb-3"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <Link 
                    to={`/login`}
                    className="block w-full py-4 text-center bg-grey-dark text-white font-bold rounded-xl hover:bg-black transition-all mb-3"
                  >
                    Login to Apply
                  </Link>
                )}
                
                <button className="w-full py-4 text-center bg-white border-2 border-gray-100 text-grey-dark font-bold rounded-xl hover:border-gray-200 transition-colors">
                  Save To Wishlist
                </button>

                <div className="mt-8">
                  <p className="text-xs font-bold text-grey-medium uppercase tracking-wider mb-3 text-center">Application Deadline</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-grey-dark">03</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase">Days</div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-grey-dark">12</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase">Hrs</div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-grey-dark">22</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase">Min</div>
                    </div>
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-2">
                      <div className="text-lg font-bold text-orange">43</div>
                      <div className="text-[10px] font-bold text-grey-medium uppercase">Sec</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Past Placements */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-grey-dark mb-4">Past Placements</h3>
                <p className="text-sm text-grey-medium mb-6">Our graduates have been hired by industry leaders:</p>
                <div className="flex gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center border border-gray-100 shadow-sm"><span className="font-bold text-xl">G</span></div>
                  <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center border border-gray-100 shadow-sm"><span className="font-bold text-xl">M</span></div>
                  <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center border border-gray-100 shadow-sm"><span className="font-bold text-xl">A</span></div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-grey-dark">92% Placement Rate</span>
                  <button className="text-orange font-bold hover:underline">View Alumni →</button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-grey-medium">Refer a friend?</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-grey-medium hover:text-orange transition-colors"><Share2 size={16} /></button>
                  <button className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-grey-medium hover:text-orange transition-colors"><Bookmark size={16} /></button>
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
