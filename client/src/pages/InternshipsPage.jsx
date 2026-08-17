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
      <div className="min-h-screen flex items-center justify-center bg-grey-light dark:bg-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-grey-light dark:bg-navy min-h-screen font-sans">
      <Helmet>
        <title>Internship Programs - EDIZO</title>
        <meta name="description" content="Explore real industry internship programs at EDIZO. Work on live projects, get mentored by experts, and launch your career." />
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <section className="pb-16 pt-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-5 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-xs mb-6 tracking-wider uppercase"
            >
              EDIZO Academy & Upskilling
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-extrabold text-navy dark:text-white mb-6 leading-tight"
            >
              Launch Your Career With <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-dark">Real Experience</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-grey-medium leading-relaxed"
            >
              Hands-on internship programs designed to give students and freshers real industry experience. Work on live projects, learn from mentors, and build your portfolio.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. BENEFITS SECTION */}
      <section className="py-16 bg-white dark:bg-navy-light border-y border-grey-silver/50 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-grey-light dark:bg-navy p-8 rounded-[2rem] border border-grey-silver dark:border-white/10 hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white dark:bg-navy-light rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Real Experience</h3>
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
              className="bg-grey-light dark:bg-navy p-8 rounded-[2rem] border border-grey-silver dark:border-white/10 hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white dark:bg-navy-light rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Eligibility</h3>
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
              className="bg-grey-light dark:bg-navy p-8 rounded-[2rem] border border-grey-silver dark:border-white/10 hover:border-orange/30 transition-all group"
            >
              <div className="w-12 h-12 bg-white dark:bg-navy-light rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={24} className="text-orange" />
              </div>
              <h3 className="text-xl font-bold text-navy dark:text-white mb-3">Flexible Modes</h3>
              <p className="text-grey-medium leading-relaxed mb-4">Choose a schedule and duration that perfectly fits your academic calendar.</p>
              <ul className="space-y-2 text-sm text-grey-medium font-medium">
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> 1 to 3 Months duration</li>
                <li className="flex items-center"><CheckCircle size={14} className="text-green-500 mr-2" /> Remote & Hybrid available</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. INTERNSHIPS GRID (Solid Crisp Card UI) */}
      <section className="py-24 bg-grey-light dark:bg-navy">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-navy dark:text-white mb-4">Open Programs</h2>
            <p className="text-lg text-grey-medium max-w-2xl mx-auto">
              Select a domain to view the curriculum, requirements, and apply.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {internships.map((internship, index) => {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              const imgUrl = internship.image && internship.image !== '/images/internship.png'
                ? (internship.image.startsWith('http') ? internship.image : `${API_URL}${internship.image}`) 
                : null;

              return (
                <motion.div 
                  key={internship.id || index}
                  variants={itemVariants}
                  className="bg-white dark:bg-navy-light rounded-[2.5rem] p-8 group flex flex-col h-full border border-grey-silver dark:border-white/10 shadow-sm hover:shadow-xl hover:border-orange/40 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Category Badge & Rating */}
                  <div className="mb-6 flex justify-between items-center">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange/10 text-orange border border-orange/20">
                      {internship.category || 'Engineering'}
                    </span>
                    <div className="flex items-center gap-1 text-orange">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold text-navy dark:text-white ml-1">{internship.rating || '4.9'}</span>
                    </div>
                  </div>

                  {/* Optional Image Header */}
                  {imgUrl && (
                    <div className="h-44 w-full rounded-2xl overflow-hidden mb-6 bg-grey-silver">
                      <img src={imgUrl} alt={internship.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-2xl font-display font-bold text-navy dark:text-white leading-tight mb-4 group-hover:text-orange transition-colors">
                    {internship.title}
                  </h3>

                  {/* Details List */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-3 text-grey-dark dark:text-grey-silver text-sm">
                      <Building2 size={18} className="text-orange" />
                      <span className="font-semibold">{internship.company || 'EDIZO Team'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-grey-dark dark:text-grey-silver text-sm">
                      <Clock size={18} className="text-orange" />
                      <span className="font-semibold">{internship.duration || '1 - 3 Months'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-grey-dark dark:text-grey-silver text-sm">
                      <MapPin size={18} className="text-orange" />
                      <span className="font-semibold">{internship.mode || 'Remote / Hybrid'}</span>
                    </li>
                  </ul>

                  {/* Footer */}
                  <div className="mt-auto pt-6 border-t border-navy/10 dark:border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold tracking-wider uppercase text-grey-medium mb-1">Stipend / Fees</p>
                      <p className="text-base font-bold text-navy dark:text-white">
                        {internship.stipend || 'Certificate Included'}
                      </p>
                    </div>
                    
                    <Link to={`/internships/${internship.id}`} className="block">
                      <div className="w-11 h-11 rounded-full bg-navy dark:bg-white text-white dark:text-navy group-hover:bg-orange group-hover:text-white flex items-center justify-center transition-all shadow-md">
                        <ChevronRight size={20} />
                      </div>
                    </Link>
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
