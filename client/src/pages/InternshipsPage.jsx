import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Clock, MapPin, Building2, ChevronRight, Briefcase, Award, CheckCircle } from 'lucide-react';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {  
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/internships`);
        const data = await res.json();
        setInternships(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch internships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  const getBentoConfig = (index, internship) => {
    const pattern = index % 5;
    
    // Helper to safely render image
    const renderImage = (className) => {
      if (internship && internship.image) {
        return (
          <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
            <img 
              src={internship.image} 
              alt={internship.title} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          </div>
        );
      }
      return null;
    };

    switch (pattern) {
      case 0:
        return {
          span: "md:col-span-2 md:row-span-2",
          bg: internship?.image ? "bg-black" : "bg-white",
          text: internship?.image ? "text-white" : "text-grey-dark",
          textSecondary: internship?.image ? "text-white/80" : "text-grey-medium",
          border: internship?.image ? "border-transparent" : "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-white hover:text-orange shadow-orange/30",
          visual: internship?.image ? renderImage("rounded-[2.5rem]") : (
            <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-grey-light rounded-tl-3xl border-t border-l border-grey-silver flex flex-col p-6 shadow-2xl transition-transform duration-700 group-hover:-translate-y-6 group-hover:-translate-x-6 z-0">
              <div className="w-full h-8 bg-white rounded-lg mb-4 flex items-center px-4 gap-2 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-xl p-4 grid grid-cols-2 gap-4 shadow-sm">
                 <div className="bg-orange/10 rounded-lg"></div>
                 <div className="bg-blue-500/10 rounded-lg"></div>
              </div>
            </div>
          )
        };
      case 1:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-orange",
          text: "text-white",
          textSecondary: "text-white/80",
          border: "border-orange-dark",
          iconColor: "text-white",
          buttonBg: "bg-white text-orange hover:bg-navy hover:text-white shadow-black/10",
          visual: (
             <div className="absolute -bottom-8 -right-8 w-48 h-64 bg-white/10 backdrop-blur-md rounded-[2rem] border-[4px] border-white/20 p-4 transition-transform duration-500 group-hover:-rotate-12 group-hover:-translate-y-4 z-0">
               <div className="w-12 h-2 bg-white/30 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md"></div>
               <div className="w-full h-1/3 bg-white/20 rounded-xl mt-4"></div>
             </div>
          )
        };
      case 2:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-navy",
          text: "text-white",
          textSecondary: "text-white/70",
          border: "border-navy-light",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-white hover:text-navy shadow-black/20",
          visual: (
             <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-45 z-0 opacity-50">
               <div className="absolute inset-0 border border-white/20 rounded-full"></div>
               <div className="absolute inset-4 border border-dashed border-white/40 rounded-full"></div>
               <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange rounded-full"></div>
             </div>
          )
        };
      case 3:
        return {
          span: "md:col-span-2 row-span-1",
          bg: "bg-white",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-navy text-white hover:bg-orange shadow-orange/30",
          visual: (
             <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange/5 to-transparent z-0 opacity-50 transition-opacity group-hover:opacity-100"></div>
          )
        };
      case 4:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-grey-light",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-navy shadow-orange/20",
          visual: (
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-2xl z-0 transition-transform group-hover:scale-150"></div>
          )
        };
      default:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-white",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-navy text-white hover:bg-orange shadow-orange/30",
          visual: null
        };
    }
  };

  return (
    <div className="bg-grey-light min-h-screen transition-colors duration-500 font-sans">
      <Helmet>
        <title>Internships - EDIZO</title>
        <meta name="description" content="Kickstart your career with hands-on internship programs at EDIZO. Gain real industry experience in design, development, and marketing." />
      </Helmet>
      
      {/* 1. HERO SECTION (Dark Theme) */}
      <section className="pt-32 pb-24 bg-navy relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-orange font-bold text-xs mb-6 tracking-wider uppercase backdrop-blur-md"
            >
              <Award size={14} className="mr-2" /> Edizo Academy
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-[1.1] tracking-tight text-white"
            >
              Accelerate Your <span className="text-orange">Tech Career</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-10"
            >
              Hands-on internship programs designed to give students and freshers real industry experience. Work on live projects, learn from mentors, and build your portfolio.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION (Light Theme) */}
      <section className="py-20 bg-white border-b border-grey-silver/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-grey-light p-8 rounded-[2rem] border border-grey-silver hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-grey-dark mb-3">Real Experience</h3>
              <p className="text-grey-medium leading-relaxed mb-4">Work on active client projects instead of just theory. Build real software.</p>
              <ul className="space-y-2 text-sm text-grey-medium font-medium">
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Pre-Placement Offers (PPO)</li>
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Letter of Recommendation</li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-grey-light p-8 rounded-[2rem] border border-grey-silver hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-grey-dark mb-3">Eligibility</h3>
              <p className="text-grey-medium leading-relaxed mb-4">Open to passionate learners ready to upskill in a professional environment.</p>
              <ul className="space-y-2 text-sm text-grey-medium font-medium">
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Degree/Diploma students</li>
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Basic domain knowledge</li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-grey-light p-8 rounded-[2rem] border border-grey-silver hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-grey-dark mb-3">Flexible Modes</h3>
              <p className="text-grey-medium leading-relaxed mb-4">Choose a schedule and duration that perfectly fits your academic calendar.</p>
              <ul className="space-y-2 text-sm text-grey-medium font-medium">
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> 1 to 3 Months duration</li>
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Remote & Hybrid available</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. INTERNSHIPS GRID */}
      <section className="py-24 bg-grey-light">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-4">Open Programs</h2>
            <p className="text-lg text-grey-medium max-w-2xl mx-auto">
              Select a domain to view the curriculum, requirements, and apply.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[380px]"
          >
            {internships.map((internship, index) => {
              const conf = getBentoConfig(index, internship);
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              const imgUrl = internship.image && internship.image !== '/images/internship.png'
                ? (internship.image.startsWith('http') ? internship.image : `${API_URL}${internship.image}`) 
                : null;

              return (
                <motion.div 
                  key={internship.id}
                  variants={itemVariants}
                  className={`${conf.span} ${imgUrl ? 'bg-navy text-white border-navy-light' : conf.bg + ' ' + conf.border} rounded-[2.5rem] p-8 group flex flex-col h-full relative overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
                >
                  {/* Background Image */}
                  {imgUrl ? (
                    <>
                      <img 
                        src={imgUrl} 
                        alt={internship.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700 z-0"
                      />
                      <div className="absolute inset-0 bg-navy/20 z-0"></div>
                    </>
                  ) : (
                    conf.visual
                  )}
                  
                  <div className={`relative z-10 flex flex-col h-full transition-all duration-500 ${imgUrl ? 'bg-navy/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 -m-2 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0' : ''}`}>
                    {/* Category Badge */}
                    <div className="mb-6 flex justify-between items-start">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${imgUrl || index % 5 === 1 || index % 5 === 2 ? 'bg-white/10 text-white border-white/20 border' : 'bg-grey-light border border-grey-silver text-grey-dark'}`}>
                        {internship.category}
                      </span>
                      <div className={`flex items-center gap-1 ${imgUrl ? 'text-orange' : conf.iconColor}`}>
                        <Star size={16} fill="currentColor" />
                        <span className={`text-sm font-bold ml-1 ${imgUrl ? 'text-white' : conf.text}`}>{internship.rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl md:text-3xl font-display font-bold leading-tight mb-4 group-hover:-translate-y-1 transition-transform ${imgUrl ? 'text-white' : conf.text}`}>
                      {internship.title}
                    </h3>

                    {/* Details List */}
                    <ul className="space-y-3 mb-8 flex-grow">
                      <li className="flex items-center gap-3">
                        <Building2 size={18} className={imgUrl ? 'text-orange' : conf.iconColor} />
                        <span className={`font-medium ${imgUrl ? 'text-gray-200' : 'text-grey-dark'}`}>{internship.company}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Clock size={18} className={imgUrl ? 'text-orange' : conf.iconColor} />
                        <span className={`font-medium ${imgUrl ? 'text-gray-200' : 'text-grey-dark'}`}>{internship.duration || '1 - 3 Months'}</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <MapPin size={18} className={imgUrl ? 'text-orange' : conf.iconColor} />
                        <span className={`font-medium ${imgUrl ? 'text-gray-200' : 'text-grey-dark'}`}>{internship.mode}</span>
                      </li>
                    </ul>

                    {/* Footer */}
                    <div className={`mt-auto pt-6 border-t flex justify-between items-end ${imgUrl ? 'border-white/20' : 'border-current/10'}`}>
                      <div>
                        <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${imgUrl ? 'text-gray-300' : 'text-grey-medium'}`}>Stipend</p>
                        <p className={`text-lg font-bold ${imgUrl ? 'text-white' : conf.text}`}>
                          {internship.stipend || 'Unpaid'}
                        </p>
                      </div>
                      
                      <Link to={`/internships/${internship.id}`} className="block">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all shadow-md ${imgUrl ? 'bg-white text-orange' : conf.buttonBg}`}>
                          <ChevronRight size={24} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default InternshipsPage;
