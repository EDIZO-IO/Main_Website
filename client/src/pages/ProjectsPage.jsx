import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layers, ArrowUpRight, Sparkles } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const [projRes, servRes] = await Promise.all([
          fetch(`${API_URL}/api/portfolio`),
          fetch(`${API_URL}/api/services`).catch(() => null)
        ]);

        if (projRes.ok) {
          const data = await projRes.json();
          setProjects(Array.isArray(data) ? data : []);
        }
        if (servRes && servRes.ok) {
          const servData = await servRes.json();
          setServices(Array.isArray(servData) ? servData : []);
        }
      } catch (err) {
        console.error("Failed to fetch projects or services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute category list dynamically from services and projects
  const categories = useMemo(() => {
    const set = new Set();
    set.add('All');

    services.forEach(s => {
      if (s.title) set.add(s.title);
      if (s.category) set.add(s.category);
    });

    projects.forEach(p => {
      if (p.service_title) set.add(p.service_title);
      if (p.service_category) set.add(p.service_category);
      if (p.category) set.add(p.category);
    });

    return Array.from(set).filter(Boolean);
  }, [projects, services]);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => {
      const matchServiceTitle = p.service_title && p.service_title.toLowerCase() === selectedCategory.toLowerCase();
      const matchServiceCategory = p.service_category && p.service_category.toLowerCase() === selectedCategory.toLowerCase();
      const matchCategory = p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchServiceTitle || matchServiceCategory || matchCategory;
    });
  }, [projects, selectedCategory]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center min-h-screen bg-grey-light dark:bg-navy flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg font-medium text-navy dark:text-white">
          <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          Loading showcase projects...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-grey-light dark:bg-navy text-navy dark:text-white min-h-screen font-sans">
      <Helmet>
        <title>Our Projects — EDIZO Portfolio</title>
        <meta name="description" content="Explore EDIZO's showcase projects categorized by service — Web Development, Mobile Apps, Graphic Design, SEO & Digital Marketing." />
      </Helmet>

      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-xs mb-6 tracking-widest uppercase"
          >
            <Sparkles size={14} className="text-orange" />
            Our Showcase & Client Work
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-[1.1] tracking-tight text-navy dark:text-white"
          >
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-dark">Impact & Growth</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-grey-medium dark:text-grey-silver leading-relaxed max-w-3xl mx-auto"
          >
            Explore our curated portfolio split by specialized service lines — from full-stack platforms and mobile applications to brand designs and growth campaigns.
          </motion.p>
        </div>

        {/* Category Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap mb-16 px-4"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  isSelected 
                    ? 'bg-orange text-white shadow-lg shadow-orange/30 border border-orange' 
                    : 'bg-white dark:bg-navy-light text-navy dark:text-white border border-navy/10 dark:border-white/10 hover:border-orange/40 hover:text-orange'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {category === 'All' && <Layers size={14} />}
                  {category}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-10"
          >
            {filteredProjects.map((project, index) => (
              <motion.div 
                key={project.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group relative bg-white dark:bg-navy-light rounded-[2.5rem] overflow-hidden border border-navy/10 dark:border-white/10 hover:border-orange/40 transition-all duration-500 flex flex-col h-full shadow-md hover:shadow-2xl"
              >
                {/* Project Image Container */}
                <div className="h-[340px] md:h-[380px] w-full relative overflow-hidden bg-grey-silver dark:bg-navy">
                  <img 
                    src={project.image_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}` : `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80&sig=${project.id}`} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Category Badges */}
                  <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                    {project.service_title && (
                      <span className="px-4 py-1.5 rounded-full bg-orange text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
                        {project.service_title}
                      </span>
                    )}
                    {project.category && (
                      <span className="px-4 py-1.5 rounded-full bg-white/90 text-navy text-xs font-bold uppercase tracking-wider border border-navy/10 shadow-sm">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex-grow flex flex-col bg-white dark:bg-navy-light rounded-b-[2.5rem]">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-navy dark:text-white mb-2 group-hover:text-orange transition-colors">
                    {project.title}
                  </h3>
                  
                  {project.client && (
                    <p className="text-xs font-extrabold text-orange uppercase tracking-widest mb-4">
                      Client: {project.client}
                    </p>
                  )}

                  <p className="text-grey-dark dark:text-grey-silver text-sm md:text-base leading-relaxed mb-8 flex-grow">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-navy/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-navy dark:text-white font-bold text-sm group-hover:text-orange transition-colors flex items-center gap-1">
                      Explore Case Details
                    </span>
                    <div className="w-10 h-10 rounded-full bg-grey-light dark:bg-navy group-hover:bg-orange text-navy dark:text-white group-hover:text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-navy-light rounded-3xl border border-navy/10 dark:border-white/10 max-w-xl mx-auto shadow-sm">
            <Layers size={40} className="mx-auto text-orange mb-4" />
            <h3 className="text-xl font-bold text-navy dark:text-white mb-2">No Projects Found</h3>
            <p className="text-grey-medium text-sm">There are no showcase projects listed under "{selectedCategory}" yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectsPage;
