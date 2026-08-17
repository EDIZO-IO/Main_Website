import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle, Code, Layers, Layout, Server, 
  ChevronDown, ExternalLink, ArrowRight, ShieldCheck, 
  Smartphone, Zap, ChevronUp 
} from 'lucide-react';

const FAQItem = ({ faq, isOpen, toggle }) => {
  return (
    <div className="border border-grey-silver rounded-2xl mb-4 overflow-hidden bg-white">
      <button 
        onClick={toggle}
        className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
      >
        <span className="font-bold text-grey-dark pr-8">{faq.question}</span>
        {isOpen ? <ChevronUp className="text-orange shrink-0" /> : <ChevronDown className="text-grey-medium shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-5 text-grey-medium leading-relaxed"
          >
            {faq.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [portfolioProjects, setPortfolioProjects] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Fetch Service Details
        const res = await fetch(`${API_URL}/api/services/${id}`);
        if (!res.ok) throw new Error('Not found');
        const service = await res.json();
        
        // Parse JSON fields safely
        ['features', 'solutions', 'technologies', 'process', 'benefits', 'faqs'].forEach(field => {
          if (service[field] && typeof service[field] === 'string') {
            try {
              service[field] = JSON.parse(service[field]);
            } catch (e) {
              console.warn(`Failed to parse ${field}:`, e);
            }
          }
        });
        
        setData(service);

        // Fetch Portfolio Projects to match Category
        try {
          const portRes = await fetch(`${API_URL}/api/portfolio`);
          if (portRes.ok) {
            const allProjects = await portRes.json();
            // Filter projects loosely based on category match, fallback to some projects if none match
            const related = allProjects.filter(p => 
              p.category.toLowerCase().includes(service.category?.toLowerCase() || '') ||
              service.category?.toLowerCase().includes(p.category.toLowerCase())
            ).slice(0, 3);
            
            setPortfolioProjects(related.length > 0 ? related : allProjects.slice(0, 3));
          }
        } catch (e) {
          console.error("Failed to fetch related projects");
        }

      } catch (err) {
        console.error("Failed to fetch service details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
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
        <h1 className="text-4xl font-display font-bold text-grey-dark">Service not found</h1>
        <Link to="/services" className="text-orange hover:underline mt-4 inline-block font-bold">Return to Services</Link>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-20 bg-grey-light relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/services" className="inline-flex items-center text-grey-medium hover:text-orange mb-8 transition-colors font-medium">
            <ArrowLeft size={18} className="mr-2" /> Back to Services
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {data.category && (
                <div className="inline-block px-4 py-1.5 rounded-full bg-navy text-white text-xs font-bold tracking-wider uppercase mb-6 shadow-md">
                  {data.category}
                </div>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-grey-dark mb-6 leading-tight">
                {data.title}
              </h1>
              
              <p className="text-xl text-grey-medium mb-10 leading-relaxed max-w-xl">
                {data.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/contact" className="px-8 py-4 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-1 flex items-center group">
                  Discuss Your Project
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/portfolio" className="px-8 py-4 bg-white text-grey-dark border border-grey-silver font-bold rounded-full hover:border-grey-dark transition-all shadow-sm hover:shadow flex items-center">
                  View Our Work
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-grey-medium">
                <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-green-500" /> Custom-built</div>
                <div className="flex items-center gap-2"><Layers size={16} className="text-blue-500" /> Scalable architecture</div>
                <div className="flex items-center gap-2"><Smartphone size={16} className="text-orange" /> Mobile responsive</div>
                <div className="flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> Ongoing support</div>
              </div>
            </motion.div>
            
            {data.image_url && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-orange/20 to-transparent rounded-[3rem] transform translate-x-4 translate-y-4"></div>
                <img 
                  src={`${API_URL}${data.image_url}`} 
                  alt={data.title} 
                  className="w-full h-auto object-cover rounded-[3rem] shadow-2xl relative z-10 border-4 border-white"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 2. WHAT WE BUILD (Solutions) */}
      {data.solutions && data.solutions.length > 0 && (
        <section className="py-24 bg-white border-b border-grey-silver/30">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">What We Build</h2>
              <p className="text-lg text-grey-medium max-w-2xl mx-auto">
                Custom platforms and solutions designed specifically for your business operations and target audience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.solutions.map((solution, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-grey-light p-8 rounded-3xl border border-grey-silver hover:border-orange/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layout size={24} className="text-orange" />
                  </div>
                  <h3 className="text-xl font-bold text-grey-dark mb-3">{solution.title}</h3>
                  <p className="text-grey-medium leading-relaxed">{solution.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. CAPABILITIES (Features) */}
      {data.features && data.features.length > 0 && (
        <section className="py-24 bg-grey-light">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">Core Capabilities</h2>
                <p className="text-lg text-grey-medium mb-8">
                  The foundational elements we integrate into every {data.title.toLowerCase()} project.
                </p>
                <div className="w-16 h-1 bg-orange rounded-full"></div>
              </div>
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.features.map((feat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-navy/5 flex items-start gap-4"
                  >
                    <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                    <span className="font-bold text-grey-dark">
                      {typeof feat === 'string' ? feat : feat.title || JSON.stringify(feat)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. TECHNOLOGY STACK */}
      {data.technologies && data.technologies.length > 0 && (
        <section className="py-24 bg-navy text-white relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Technologies We Work With</h2>
              <p className="text-navy-light/80 text-lg max-w-2xl mx-auto">
                We utilize modern, scalable frameworks and robust infrastructure to ensure your software is fast, secure, and future-proof.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.technologies.map((techGroup, idx) => (
                <div key={idx} className="bg-navy-light/50 backdrop-blur-md p-8 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    {idx === 0 ? <Layout size={24} className="text-orange" /> :
                     idx === 1 ? <Server size={24} className="text-blue-400" /> :
                     idx === 2 ? <DatabaseIcon size={24} className="text-green-400" /> :
                     <Code size={24} className="text-purple-400" />}
                    <h3 className="text-xl font-bold">{techGroup.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {techGroup.items.map((item, i) => (
                      <li key={i} className="flex items-center text-white/80 font-medium">
                        <span className="w-1.5 h-1.5 bg-orange rounded-full mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. DEVELOPMENT PROCESS */}
      {data.process && data.process.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">How We Work</h2>
              <p className="text-lg text-grey-medium max-w-2xl mx-auto">
                A proven, structured approach to take your project from initial concept to successful launch and beyond.
              </p>
            </div>
            
            <div className="space-y-8">
              {data.process.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col md:flex-row gap-6 md:gap-12 items-start group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-grey-light border-2 border-grey-silver flex items-center justify-center text-xl font-display font-bold text-grey-dark group-hover:border-orange group-hover:bg-orange/5 transition-colors z-10 shrink-0">
                      0{idx + 1}
                    </div>
                    {idx < data.process.length - 1 && (
                      <div className="w-0.5 h-full min-h-[4rem] bg-grey-silver mt-4 hidden md:block group-hover:bg-orange/30 transition-colors"></div>
                    )}
                  </div>
                  
                  <div className="bg-grey-light/50 p-8 rounded-3xl border border-grey-silver w-full group-hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                    <h3 className="text-2xl font-bold text-grey-dark mb-3">{step.title}</h3>
                    <p className="text-lg text-grey-medium">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE EDIZO (Benefits) */}
      {data.benefits && data.benefits.length > 0 && (
        <section className="py-24 bg-grey-light border-y border-grey-silver/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">Why Choose Edizo?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.benefits.map((benefit, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-grey-silver/50"
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-grey-dark mb-2">{benefit.title}</h3>
                      <p className="text-grey-medium leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. RELATED PROJECTS (Portfolio) */}
      {portfolioProjects.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">Projects Related to This Service</h2>
                <p className="text-lg text-grey-medium">See how we've applied these capabilities in the real world.</p>
              </div>
              <Link to="/portfolio" className="hidden md:flex items-center text-orange font-bold hover:text-orange-dark transition-colors">
                View All Projects <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioProjects.map(project => (
                <Link to={`/portfolio/${project.id}`} key={project.id} className="group cursor-pointer">
                  <div className="bg-grey-light rounded-3xl overflow-hidden mb-6 aspect-video relative">
                    <img 
                      src={project.image_url ? `${API_URL}${project.image_url}` : '/images/dashboard_mockup.png'} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-6 py-3 bg-white text-navy font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center">
                        View Case Study <ArrowRight size={16} className="ml-2" />
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-orange font-bold text-sm mb-2 block">{project.category}</span>
                    <h3 className="text-2xl font-bold text-grey-dark mb-2 group-hover:text-orange transition-colors">{project.title}</h3>
                    <p className="text-grey-medium line-clamp-2">{project.description}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10 text-center md:hidden">
              <Link to="/portfolio" className="inline-flex items-center text-orange font-bold hover:text-orange-dark transition-colors">
                View All Projects <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. FAQ */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="py-24 bg-grey-light">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {data.faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  faq={faq} 
                  isOpen={openFaqIndex === index} 
                  toggle={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)} 
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FINAL CTA */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/digital_ecosystem_bg.png')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Have a Project in Mind?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Tell us what you're trying to build. We'll understand your requirements and suggest the right technology and approach to make it a reality.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link to="/contact" className="w-full sm:w-auto px-10 py-5 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-1 text-lg">
              Discuss Your Project
            </Link>
            <Link to="/portfolio" className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 hover:border-white transition-all text-lg">
              View Our Work
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

// Database icon helper for Technology section
const DatabaseIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

export default ServiceDetails;
