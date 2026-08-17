import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/portfolio`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-gray-500 min-h-screen">Loading projects...</div>;
  }

  return (
    <div className="pt-32 pb-32 bg-white dark:bg-[#0a1128] min-h-screen transition-colors duration-500 font-sans">
      <Helmet>
        <title>Our Projects - EDIZO</title>
        <meta name="description" content="Explore our latest projects showcasing our expertise across various domains and technologies." />
      </Helmet>
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-sm mb-8 tracking-wider uppercase"
          >
            Portfolio
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold mb-8 text-navy dark:text-white leading-[1.1] tracking-tight"
          >
            A Glimpse of Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-[#ff7b00]">Finest Work</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-navy/70 dark:text-white/60 leading-relaxed max-w-3xl mx-auto"
          >
            Explore our latest projects showcasing our expertise across various domains, technologies, and creative challenges.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer flex flex-col h-full border border-gray-100 dark:border-white/10 hover:border-orange/30 dark:hover:border-orange/30 transition-colors shadow-sm hover:shadow-2xl dark:shadow-none"
            >
              {/* Project Image */}
              <div className="h-[400px] w-full relative overflow-hidden bg-gray-100 dark:bg-[#060b19]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <img 
                  src={project.image_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}` : `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80&sig=${project.id}`} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Overlay Tags */}
                <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              
              {/* Project Details */}
              <div className="p-10 flex-grow flex flex-col">
                <h3 className="text-3xl font-display font-bold text-navy dark:text-white mb-3 group-hover:text-orange transition-colors">
                  {project.title}
                </h3>
                {project.client && (
                  <p className="text-sm font-bold text-navy/50 dark:text-white/50 uppercase tracking-widest mb-6">
                    Client: {project.client}
                  </p>
                )}
                <p className="text-navy/70 dark:text-white/60 leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-8 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-navy dark:text-white font-bold group-hover:text-orange transition-colors">
                    View Case Study
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors">
                    &rarr;
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
