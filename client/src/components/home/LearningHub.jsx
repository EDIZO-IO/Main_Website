import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, GraduationCap, Code2, Palette, TrendingUp, Video, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../ui/SpotlightCard';
import ShinyText from '../ui/ShinyText';

const CATEGORY_ICONS = {
  Development: Code2,
  Design: Palette,
  Marketing: TrendingUp,
  Media: Video,
  Default: GraduationCap
};

const CATEGORY_STYLES = [
  { border: 'border-orange/20', text: 'text-[#D93800] dark:text-[#FF855C]', badge: 'bg-orange/15 text-[#D93800] dark:text-[#FF855C]' },
  { border: 'border-blue-500/20', text: 'text-blue-600 dark:text-cyan-400', badge: 'bg-blue-500/15 text-blue-600 dark:text-cyan-400' },
  { border: 'border-purple-500/20', text: 'text-purple-600 dark:text-purple-400', badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  { border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
];

const LearningHub = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/internships`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setInternships(Array.isArray(data) ? data.slice(0, 4) : []);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to load internships:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
    return () => controller.abort();
  }, []);

  if (!loading && internships.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 bg-grey-light dark:bg-[#060B13] transition-colors duration-500 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-5">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-widest mb-4">
              <Sparkles size={14} />
              <ShinyText text="Industrial Tech Internship Academy" />
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.08] tracking-tight"
            >
              Master Real-World Engineering by <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                Building Production Software.
              </span>
            </motion.h2>
          </div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Link 
              to="/internships" 
              className="px-7 py-3.5 bg-navy dark:bg-white text-white dark:text-navy rounded-full font-bold text-xs uppercase tracking-wider hover:bg-[#D93800] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-all flex items-center gap-2 shadow-md hover:shadow-orange/30 group"
            >
              All Internship Programs <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {internships.map((intern, idx) => {
            const style = CATEGORY_STYLES[idx % CATEGORY_STYLES.length];
            const IconComponent = CATEGORY_ICONS[intern.category] || CATEGORY_ICONS.Default;

            return (
              <motion.div 
                key={intern.id || intern.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex"
              >
                <SpotlightCard className={`p-7 w-full flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl border ${style.border}`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${style.badge} flex items-center justify-center font-bold shadow-xs`}>
                        <IconComponent size={22} />
                      </div>
                      {intern.category && (
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${style.badge}`}>
                          {intern.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-display font-extrabold text-navy dark:text-white mb-2 line-clamp-2">
                      {intern.title}
                    </h3>
                    <p className="text-navy/70 dark:text-white/70 font-medium text-xs leading-relaxed mb-6 line-clamp-3">
                      {intern.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-navy/10 dark:border-white/10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-navy/75 dark:text-white/75">
                      <Clock size={13} className="text-orange" />
                      {intern.duration || '2-3 Months'}
                    </span>
                    <Link 
                      to={`/internships/${intern.id}`} 
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.text} hover:underline`}
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LearningHub;
