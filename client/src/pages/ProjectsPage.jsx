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
          setProjects(data);
        }
        if (servRes && servRes.ok) {
          const servData = await servRes.json();
          setServices(servData);
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

    // Add service categories/titles
    services.forEach(s => {
      if (s.title) set.add(s.title);
      if (s.category) set.add(s.category);
    });

    // Add project specific categories
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
      <div className="pt-40 pb-24 text-center text-gray-400 min-h-screen bg-navy flex items-center justify-center">
        <div className="flex items-center gap-3 text-lg font-medium">
          <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          Loading showcase projects...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32 bg-[#060B19] text-white min-h-screen font-sans selection:bg-orange selection:text-white">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-xs mb-6 tracking-widest uppercase backdrop-blur-md"
          >
            <Sparkles size={14} className="text-orange" />
            Our Showcase & Client Work
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-[1.1] tracking-tight text-white"
          >
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange via-orange-light to-amber-400">Impact & Growth</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
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
                    ? 'text-white shadow-lg shadow-orange/20 border border-orange/50' 
                    : 'text-gray-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {isSelected && (
                  <motion.div 
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange to-orange-dark rounded-full z-0"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
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
                className="group relative bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-orange/40 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:shadow-orange/10"
              >
                {/* Project Image Container */}
                <div className="h-[340px] md:h-[400px] w-full relative overflow-hidden bg-navy-dark">
                  <img 
                    src={project.image_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}` : `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80&sig=${project.id}`} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060B19] via-[#060B19]/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  
                  {/* Category Badges */}
                  <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                    {project.service_title && (
                      <span className="px-4 py-1.5 rounded-full bg-orange/90 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg">
                        {project.service_title}
                      </span>
                    )}
                    {project.category && (
                      <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                        {project.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 flex-grow flex flex-col relative z-20 -mt-12 bg-navy/90 backdrop-blur-xl rounded-t-[2rem] border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 group-hover:text-orange transition-colors">
                    {project.title}
                  </h3>
                  
                  {project.client && (
                    <p className="text-xs font-extrabold text-orange/90 uppercase tracking-widest mb-4">
                      Client: {project.client}
                    </p>
                  )}

                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 flex-grow">
                    {project.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white font-bold text-sm group-hover:text-orange transition-colors flex items-center gap-1">
                      Explore Case Details
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-orange text-white flex items-center justify-center transition-all duration-300 transform group-hover:scale-110">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 max-w-xl mx-auto">
            <Layers size={40} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400 text-sm">There are no showcase projects listed under "{selectedCategory}" yet.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectsPage;
