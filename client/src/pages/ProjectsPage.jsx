import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Layers, ArrowUpRight, Sparkles, Search, LayoutGrid, List, X, ExternalLink, FolderGit2 } from 'lucide-react';
import TypewriterText from '../components/ui/TypewriterText';
import DecryptedText from '../components/ui/DecryptedText';
import CountUp from '../components/ui/CountUp';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
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

  // Curate and deduplicate categories to avoid excessive cognitive load
  const categories = useMemo(() => {
    const set = new Set();
    set.add('All');
    services.forEach(s => { 
      if (s.title) set.add(s.title); 
    });
    projects.forEach(p => { 
      if (p.service_title) set.add(p.service_title);
      else if (p.category) set.add(p.category); 
    });
    return Array.from(set).filter(Boolean);
  }, [projects, services]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (selectedCategory !== 'All') {
      result = result.filter(p => {
        const matchServiceTitle = p.service_title && p.service_title.toLowerCase() === selectedCategory.toLowerCase();
        const matchServiceCategory = p.service_category && p.service_category.toLowerCase() === selectedCategory.toLowerCase();
        const matchCategory = p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchServiceTitle || matchServiceCategory || matchCategory;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="pt-32 pb-16 text-center min-h-screen bg-grey-light dark:bg-[#060B13] flex items-center justify-center">
        <div className="flex items-center gap-3 text-base font-bold text-navy dark:text-white">
          <div className="w-5 h-5 border-2 border-[#D93800] border-t-transparent rounded-full animate-spin" />
          Loading showcase projects...
        </div>
      </div>
    );
  }

  return (
    <main className="pt-28 pb-16 bg-grey-light dark:bg-[#060B13] text-navy dark:text-white min-h-screen font-sans transition-colors duration-500">
      <Helmet>
        <title>Our Projects — EDIZO Portfolio</title>
        <meta name="description" content="Explore EDIZO's showcase projects categorized by service — Web Development, Mobile Apps, Graphic Design, SEO & Digital Marketing." />
      </Helmet>

      <div className="container mx-auto px-6 max-w-7xl">

        {/* Compact Header */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D93800]/10 border border-[#D93800]/25 text-[#B83200] dark:text-[#FF855C] font-bold text-xs mb-3 tracking-wide"
          >
            <Sparkles size={13} className="text-[#D93800] dark:text-[#FF855C]" aria-hidden="true" />
            <TypewriterText 
              texts={[
                "Our Showcase & Client Work",
                "Full-Stack Web & SaaS Platforms",
                "Mobile Apps & Brand Experiences",
                "Delivered by EDIZO Engineering"
              ]}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2400}
            />
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-4xl md:text-6xl font-display font-extrabold mb-3 leading-[1.1] tracking-tight text-navy dark:text-white"
          >
            Crafted for <span className="text-[#B83200] dark:text-[#FF855C] bg-clip-text bg-gradient-to-r from-[#D93800] to-[#FF855C]">Impact &amp; Growth</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm md:text-base text-navy/75 dark:text-white/75 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Explore our curated portfolio split by specialized service lines — from full-stack platforms and mobile applications to brand designs and growth campaigns.
          </motion.p>
        </div>

        {/* Compact Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-8 mb-6 py-2 border-y border-navy/10 dark:border-white/10 flex-wrap"
        >
          {[
            { label: 'Total Projects', value: projects.length },
            { label: 'Categories', value: Math.max(0, categories.length - 1) },
            { label: 'Showing', value: filteredProjects.length },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <span className="text-2xl font-display font-extrabold text-navy dark:text-white mr-1.5">
                <CountUp to={stat.value} duration={1.2} />
              </span>
              <span className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Controls: Search + Filter + View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-3 mb-8"
        >
          {/* Search + View Toggle Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/50 dark:text-white/50" size={17} aria-hidden="true" />
              <input
                type="text"
                id="projects-search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects by name, client, or keyword..."
                aria-label="Search projects"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-navy/15 dark:border-white/15 focus:border-[#D93800] focus:outline-none bg-white dark:bg-[#0B132B] text-navy dark:text-white font-medium text-xs sm:text-sm transition-all shadow-xs"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')} 
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/50 dark:text-white/50 hover:text-[#D93800] transition-colors"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-white dark:bg-[#0B132B] border border-navy/15 dark:border-white/15 rounded-xl p-1 gap-1 shadow-xs" role="group" aria-label="View layout switcher">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-navy dark:bg-white text-white dark:text-navy shadow-xs' : 'text-navy/60 dark:text-white/60 hover:text-navy dark:hover:text-white'}`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-navy dark:bg-white text-white dark:text-navy shadow-xs' : 'text-navy/60 dark:text-white/60 hover:text-navy dark:hover:text-white'}`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap" role="toolbar" aria-label="Project category filters">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isSelected}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#D93800] text-white shadow-sm border border-[#D93800]'
                      : 'bg-white dark:bg-[#0B132B] text-navy dark:text-white border border-navy/15 dark:border-white/15 hover:border-[#D93800]/50 hover:text-[#B83200] dark:hover:text-[#FF855C]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {category === 'All' && <Layers size={13} aria-hidden="true" />}
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Grid / List */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white dark:bg-[#0B132B] rounded-3xl border border-navy/10 dark:border-white/10 max-w-lg mx-auto shadow-sm px-6"
            >
              <FolderGit2 size={40} className="mx-auto text-[#D93800] mb-3" aria-hidden="true" />
              <h2 className="text-xl font-bold text-navy dark:text-white mb-1.5">No Projects Found</h2>
              <p className="text-navy/70 dark:text-white/70 text-xs mb-5">
                {searchQuery ? `No matching projects for "${searchQuery}"` : `No projects listed under "${selectedCategory}" yet.`}
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-6 py-2 bg-[#D93800] text-white rounded-full font-bold text-xs hover:bg-[#B83200] shadow-sm transition-all"
              >
                Show All Projects
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key={`grid-${selectedCategory}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, idx) => {
                const imgSrc = project.image_url 
                  ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}`)
                  : '/images/digital_product_mockup.png';

                return (
                  <motion.article
                    key={project.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="group rounded-3xl bg-white dark:bg-[#0B132B] border border-navy/10 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Area */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                        <img 
                          src={imgSrc} 
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                          <DecryptedText text={project.service_title || project.category || 'Digital Solution'} speed={30} trigger="hover" />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6">
                        <h2 className="text-lg sm:text-xl font-display font-extrabold text-navy dark:text-white mb-2 leading-snug group-hover:text-orange transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-navy/70 dark:text-white/70 leading-relaxed line-clamp-2 mb-4">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Area */}
                    <div className="px-6 pb-6 pt-3 border-t border-navy/5 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-navy/60 dark:text-white/60">
                        {project.client || 'Enterprise Client'}
                      </span>
                      {project.project_url ? (
                        <a 
                          href={project.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D93800] dark:text-[#FF855C] hover:underline"
                        >
                          <span>Live Site</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D93800] dark:text-[#FF855C]">
                          <span>Verified</span>
                          <ArrowUpRight size={13} />
                        </span>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key={`list-${selectedCategory}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col divide-y divide-navy/10 dark:divide-white/10 bg-white dark:bg-[#0B132B] rounded-3xl border border-navy/10 dark:border-white/10 overflow-hidden shadow-xs"
            >
              {filteredProjects.map((project, idx) => {
                const imgSrc = project.image_url 
                  ? (project.image_url.startsWith('http') ? project.image_url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${project.image_url}`)
                  : '/images/digital_product_mockup.png';

                return (
                  <article
                    key={project.id || idx}
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-grey-light/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={imgSrc} 
                        alt={project.title}
                        width="80"
                        height="60"
                        loading="lazy"
                        decoding="async"
                        className="w-20 h-14 rounded-xl object-cover shrink-0 bg-slate-900 border border-navy/5 dark:border-white/5"
                      />
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#D93800] dark:text-[#FF855C] mb-0.5">
                          {project.service_title || project.category || 'Digital Solution'}
                        </div>
                        <h2 className="text-base sm:text-lg font-display font-extrabold text-navy dark:text-white group-hover:text-orange transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-xs text-navy/60 dark:text-white/60 line-clamp-1 mt-0.5">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                      <span className="text-xs font-bold text-navy/60 dark:text-white/60">
                        {project.client || 'Enterprise'}
                      </span>
                      {project.project_url ? (
                        <a 
                          href={project.project_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-full bg-navy/5 dark:bg-white/10 hover:bg-orange hover:text-white text-navy dark:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>Visit</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs font-bold text-[#D93800] dark:text-[#FF855C] flex items-center gap-1">
                          <span>Verified</span>
                          <ArrowUpRight size={13} />
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
};

export default ProjectsPage;
