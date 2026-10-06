import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ExternalLink, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../ui/SpotlightCard';
import ShinyText from '../ui/ShinyText';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const controller = new AbortController();
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/portfolio`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          setProjects(Array.isArray(data) ? data.slice(0, 6) : []);
        } else {
          setProjects([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch projects:", err);
          setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
    return () => controller.abort();
  }, []);

  if (loading) {
     return (
       <section className="py-24 bg-white dark:bg-[#080E1B]">
         <div className="container mx-auto px-6 max-w-7xl">
           <div className="h-10 w-48 bg-grey-light dark:bg-[#0B132B] rounded-2xl animate-pulse mb-8" />
           <div className="grid md:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-80 bg-grey-light dark:bg-[#0B132B] rounded-3xl animate-pulse" />
             ))}
           </div>
         </div>
       </section>
     );
  }

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#080E1B] transition-colors duration-500 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Structured Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5 pb-5 border-b border-navy/10 dark:border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <ShinyText text="Enterprise Portfolio & Software Deliveries" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.1] tracking-tight"
            >
              Proven Solutions Built for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                Real-World Scalability.
              </span>
            </motion.h2>
          </div>

          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy dark:bg-white text-white dark:text-navy font-bold text-xs uppercase tracking-wider hover:bg-[#D93800] dark:hover:bg-[#FF5A1F] dark:hover:text-white transition-all duration-200 group shrink-0 shadow-sm"
          >
            <span>All Projects</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Structured 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {projects.map((project, idx) => {
            const imgSrc = project.image_url 
              ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}`)
              : '/images/digital_product_mockup.png';

            return (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex"
              >
                <SpotlightCard className="w-full p-6 flex flex-col justify-between bg-grey-light/50 dark:bg-[#0B132B] border-navy/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div>
                    {/* Project Preview Image */}
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 mb-5 border border-navy/5 dark:border-white/5 shadow-xs">
                      <img 
                        src={imgSrc} 
                        alt={project.title} 
                        width="380"
                        height="240"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                        {project.category || 'Web Application'}
                      </div>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-display font-extrabold text-navy dark:text-white mb-2 leading-snug">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-navy/70 dark:text-white/70 font-medium leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Info & Action */}
                  <div className="pt-4 border-t border-navy/10 dark:border-white/10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-navy/60 dark:text-white/60 font-mono">
                      <Code2 size={13} className="text-orange" />
                      Live Architecture
                    </span>
                    <Link 
                      to="/projects"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D93800] dark:text-[#FF855C] hover:underline"
                    >
                      <span>Explore</span>
                      <ExternalLink size={12} />
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

export default Projects;
