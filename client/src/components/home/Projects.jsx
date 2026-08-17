import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const uiStyles = ['overlap-bottom', 'overlap-side', 'overlap-top', 'overlap-center'];

const Projects = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const [windowWidth, setWindowWidth] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/portfolio`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data.slice(0, 5));
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const totalWidth = projects.length * (windowWidth < 768 ? 320 : 600) + (projects.length * 40);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${totalWidth - windowWidth + 200}px`]);

  if (loading) {
     return (
       <section className="relative h-screen bg-white dark:bg-navy py-24 overflow-hidden">
         <div className="container mx-auto px-6 mb-12">
           <div className="h-12 md:h-16 w-1/2 bg-grey-light dark:bg-navy-light rounded-2xl animate-shimmer"></div>
         </div>
         <div className="flex gap-10 px-6 lg:px-[10vw]">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className="w-[280px] md:w-[500px] shrink-0">
               <div className="w-full h-[260px] md:h-[380px] bg-grey-light dark:bg-navy-light rounded-[3rem] mb-6 animate-shimmer"></div>
               <div className="w-3/4 h-8 bg-grey-light dark:bg-navy-light rounded-xl mb-2 animate-shimmer"></div>
               <div className="w-1/2 h-6 bg-grey-light dark:bg-navy-light rounded-xl animate-shimmer"></div>
             </div>
           ))}
         </div>
       </section>
     );
  }

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-white dark:bg-navy">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-24">
        
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1] tracking-tight"
            >
              BUILT FOR <br/> THE REAL <span className="text-orange">WORLD.</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Link to="/projects" className="flex items-center gap-2 font-display font-bold text-lg text-navy dark:text-white hover:text-orange dark:hover:text-orange transition-colors">
                VIEW ALL PROJECTS <ArrowRight size={24} />
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div style={{ x }} className="flex gap-10 px-6 lg:px-[10vw]">
          {projects.map((project, idx) => {
            const uiStyle = uiStyles[idx % uiStyles.length];
            return (
            <div 
              key={`${project.title}-${idx}`}
              className="group relative w-[280px] md:w-[500px] h-[360px] md:h-[480px] shrink-0"
            >
              {/* Project Image Area */}
              <div className={`w-full h-[260px] md:h-[380px] rounded-[3rem] mb-6 overflow-hidden relative border border-navy/5 dark:border-white/10 ${project.color || 'bg-navy'}`}>
                
                {project.image_url ? (
                  <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}`} alt={project.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <>
                    {uiStyle === 'overlap-bottom' && (
                      <div className="absolute -bottom-10 right-10 w-2/3 h-2/3 bg-white shadow-2xl rounded-t-xl border border-navy/10 p-4 transition-transform duration-700 group-hover:-translate-y-8">
                        <div className="w-full h-8 bg-grey-light rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-4 h-32"><div className="bg-navy/5 rounded"></div><div className="bg-navy/5 rounded"></div></div>
                      </div>
                    )}
                    
                    {uiStyle === 'overlap-side' && (
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-3/4 bg-white shadow-2xl rounded-l-3xl border border-navy/10 flex flex-col items-center pt-8 transition-transform duration-700 group-hover:-translate-x-8">
                         <div className="w-24 h-4 bg-navy rounded-full mb-8"></div>
                         <div className="w-3/4 h-12 bg-blue-500/20 rounded-xl mb-4"></div>
                         <div className="w-3/4 h-12 bg-blue-500/20 rounded-xl"></div>
                      </div>
                    )}

                    {uiStyle === 'overlap-top' && (
                      <div className="absolute top-10 left-10 w-3/4 h-3/4 bg-white shadow-2xl rounded-xl border border-navy/10 p-6 flex flex-col transition-transform duration-700 group-hover:translate-y-8 group-hover:translate-x-8">
                         <div className="w-1/3 h-6 bg-navy/10 rounded mb-6"></div>
                         <div className="w-full flex-1 bg-purple-500/10 rounded-lg"></div>
                      </div>
                    )}

                    {uiStyle === 'overlap-center' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-white shadow-2xl rounded-2xl border border-navy/10 p-4 flex gap-4 transition-transform duration-700 group-hover:scale-110">
                         <div className="w-1/3 h-full bg-orange/20 rounded-xl"></div>
                         <div className="w-2/3 h-full flex flex-col gap-4">
                            <div className="w-full h-1/2 bg-grey-light rounded-xl"></div>
                            <div className="w-full h-1/2 bg-grey-light rounded-xl"></div>
                         </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Overlay for hover state */}
                <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <Link to={`/projects`} className="px-8 py-4 bg-orange text-white rounded-full font-bold shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2">
                        VIEW SOLUTION <ArrowRight size={18} />
                    </Link>
                </div>

              </div>

              {/* Project Info */}
              <div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-navy dark:text-white mb-2">{project.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-navy/60 dark:text-white/60 font-medium text-sm md:text-lg">{project.category}</p>
                  <span className="text-xs md:text-sm font-bold tracking-wider text-navy/40 dark:text-white/40">{project.description}</span>
                </div>
              </div>
            </div>
          )})}
        </motion.div>

      </div>
    </section>
  );
};

export default Projects;
