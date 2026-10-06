import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, X, ChevronRight, CheckCircle2, Clock, MapPin,
  Star, ArrowRight, Filter, Play, Monitor, Award, Briefcase,
  Users, Zap, BookOpen, ChevronDown, Rocket, Target, TrendingUp, Sparkles
} from 'lucide-react';
import TypewriterText from '../components/ui/TypewriterText';
import DecryptedText from '../components/ui/DecryptedText';
import CountUp from '../components/ui/CountUp';

const MODES = ['All Modes', 'Remote', 'Hybrid', 'Onsite'];
const DURATIONS = ['All Durations', '1 Month', '2 Months', '3 Months'];

const FEATURE_ICONS = {
  'Hands-on': Monitor,
  'Industry': Briefcase,
  'Completion': Award,
  'Portfolio': BookOpen,
  'Team': Users,
  'Placement': Star,
  'Flexible': Zap,
};

const InternshipsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [internships, setInternships] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [intRes, pageRes, testimRes] = await Promise.all([
          fetch(`${API_URL}/api/internships`),
          fetch(`${API_URL}/api/pages/internships`).catch(() => null),
          fetch(`${API_URL}/api/testimonials?type=internship`).catch(() => null),
        ]);
        if (intRes.ok) setInternships(await intRes.json());
        if (pageRes?.ok) setPageData(await pageRes.json());
        if (testimRes?.ok) setTestimonials(await testimRes.json());
      } catch (err) {
        console.error("Failed to fetch internships page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [API_URL]);

  const safeParse = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return fallback; }
  };

  const heroContent = safeParse(pageData?.sections?.hero, null);
  const statsData = safeParse(pageData?.sections?.stats, null);
  const whyJoin = safeParse(pageData?.sections?.whyJoin, null);
  const processSteps = safeParse(pageData?.sections?.process, null);
  const features = safeParse(pageData?.sections?.features, null);

  const categories = useMemo(() => {
    const set = new Set(['All Categories']);
    internships.forEach(i => { if (i.category) set.add(i.category); });
    return Array.from(set);
  }, [internships]);

  const filtered = useMemo(() => {
    let r = internships;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      r = r.filter(i => i.title?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q) || i.company?.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'All Categories') r = r.filter(i => i.category === selectedCategory);
    if (selectedMode !== 'All Modes') r = r.filter(i => i.mode?.toLowerCase().includes(selectedMode.toLowerCase()));
    if (selectedDuration !== 'All Durations') r = r.filter(i => i.duration?.toLowerCase().includes(selectedDuration.split(' ')[0]));
    return r;
  }, [internships, searchQuery, selectedCategory, selectedMode, selectedDuration]);

  const clearFilters = () => { setSearchQuery(''); setSelectedCategory('All Categories'); setSelectedMode('All Modes'); setSelectedDuration('All Durations'); };
  const hasFilters = searchQuery || selectedCategory !== 'All Categories' || selectedMode !== 'All Modes' || selectedDuration !== 'All Durations';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D93800] border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="bg-white dark:bg-[#060B13] font-sans min-h-screen transition-colors duration-500">
      <Helmet>
        <title>{pageData?.seo_title || "Internship Programs - EDIZO"}</title>
        <meta name="description" content={pageData?.seo_description || "Gain real industry experience at EDIZO. Work on live projects, learn from experts, and kickstart your career."} />
      </Helmet>

      {/* =============================================
          HERO SECTION — Modern & Unified
      ============================================= */}
      <section className="relative bg-grey-light dark:bg-[#060B13] pt-32 pb-16 overflow-hidden border-b border-navy/5 dark:border-white/5 transition-colors duration-500">
        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-orange/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-600/10 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs mb-5 tracking-wider uppercase w-fit shadow-xs"
              >
                <Sparkles size={14} aria-hidden="true" />
                <TypewriterText 
                  texts={[
                    "EDIZO Tech Academy",
                    "Live Industry Projects",
                    "1-on-1 Senior Mentorship",
                    "Verified Career Credentials"
                  ]}
                  typingSpeed={60}
                  deletingSpeed={30}
                  pauseDuration={2400}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-extrabold leading-[1.08] tracking-tight mb-5 text-navy dark:text-white"
              >
                <span>{heroContent?.titleLine1 || 'Learn Today.'}</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                  {heroContent?.titleLine2 || 'Build Tomorrow.'}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base sm:text-lg text-navy/80 dark:text-white/80 max-w-xl leading-relaxed mb-8 font-medium"
              >
                {heroContent?.subtitle || 'Gain real industry experience, work on live production projects, and fast-track your engineering career with EDIZO.'}
              </motion.p>

              {/* Stats strip */}
              {statsData && Array.isArray(statsData) && statsData.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap gap-6 sm:gap-8 mb-8"
                >
                  {statsData.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange/10 dark:bg-orange/20 rounded-xl flex items-center justify-center text-[#D93800] dark:text-[#FF855C] shrink-0">
                        {i === 0 ? <Users size={18} /> : i === 1 ? <Rocket size={18} /> : i === 2 ? <CheckCircle2 size={18} /> : <Target size={18} />}
                      </div>
                      <div>
                        <p className="text-xl font-extrabold text-navy dark:text-white">
                          <CountUp to={s.value} duration={1.5} suffix={typeof s.value === 'string' && s.value.includes('+') ? '+' : ''} />
                        </p>
                        <p className="text-xs text-navy/60 dark:text-white/60 font-semibold">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : null}

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex gap-4 flex-wrap items-center"
              >
                <a 
                  href="#programs" 
                  className="px-8 py-3.5 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider shadow-sm"
                >
                  <span>Explore Internships</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </a>
                <Link
                  to="/contact"
                  className="px-7 py-3.5 bg-white dark:bg-[#0B132B] text-navy dark:text-white border-2 border-navy/15 dark:border-white/15 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:border-[#D93800] dark:hover:border-[#FF5A1F] hover:text-[#D93800] dark:hover:text-[#FF855C] transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Contact Mentors</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Card Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <div className="w-full max-w-[480px] rounded-3xl bg-white dark:bg-[#0B132B] p-5 md:p-6 border border-navy/10 dark:border-white/10 shadow-xl backdrop-blur-xl relative">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-navy/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold text-navy dark:text-white uppercase tracking-wider">
                      <DecryptedText text="ACADEMY PORTAL" speed={30} trigger="view" />
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange/10 dark:bg-orange/20 text-[#D93800] dark:text-[#FF855C] font-mono text-[10px] font-bold">
                    BATCH 2026 OPEN
                  </span>
                </div>

                {/* Photo */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center mb-4 shadow-inner">
                  <img
                    src="/images/internship-hero.jpg"
                    alt="EDIZO Internship Academy Students"
                    width="440"
                    height="330"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating chip on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg">
                      <Zap size={13} className="text-orange" /> Real Production Sprints
                    </span>
                  </div>
                </div>

                {/* Bottom Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="text-xs font-bold text-navy dark:text-white mb-0.5">1-on-1 Guidance</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">Senior Dev Reviews</div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="text-xs font-bold text-navy dark:text-white mb-0.5">Live Portfolio</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">GitHub Verified</div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =============================================
          FEATURE STRIP — only from DB
      ============================================= */}
      {features && Array.isArray(features) && features.length > 0 && (
        <section className="bg-white border-b border-navy/10 py-5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[f.key] || Zap;
                return (
                  <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl hover:bg-grey-light transition-colors">
                    <div className="w-8 h-8 bg-[#D93800]/10 rounded-lg flex items-center justify-center text-[#B83200]">
                      <Icon size={16} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-navy font-bold text-xs">{f.title}</p>
                      <p className="text-navy/60 text-xs">{f.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =============================================
          MAIN CONTENT — Internships grid + sidebar
      ============================================= */}
      <section id="programs" className="py-16 bg-grey-light">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex gap-10 flex-col lg:flex-row">

            {/* LEFT: Internship cards */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <span className="text-[#B83200] font-bold text-xs tracking-wide block mb-2">
                  Open Opportunities
                </span>
                <h2 className="text-3xl font-display font-extrabold text-navy mb-2">Available Internships</h2>
                <p className="text-navy/70 text-sm md:text-base font-normal">Find the right opportunity to grow your skills and build real-world experience.</p>
              </div>

              {/* Search + Filters */}
              <div className="flex flex-wrap gap-3 mb-6" role="search" aria-label="Internship filters">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/50" size={16} aria-hidden="true" />
                  <input
                    type="text"
                    id="intern-search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by role, technology, or keyword..."
                    aria-label="Search internships"
                    className="w-full pl-11 pr-10 py-3 rounded-xl border border-navy/15 focus:border-[#D93800] focus:outline-none bg-white text-navy text-sm font-medium transition-all"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')} 
                      aria-label="Clear search input"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/50 hover:text-[#D93800]"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Category Select with Explicit Accessible Name */}
                <div className="relative">
                  <select
                    id="filter-category"
                    name="category"
                    aria-label="Filter internships by category"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="pl-4 pr-8 py-3 rounded-xl border border-navy/15 focus:border-[#D93800] focus:outline-none bg-white text-navy text-sm font-medium appearance-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/50 pointer-events-none" aria-hidden="true" />
                </div>

                {/* Mode Select with Explicit Accessible Name */}
                <div className="relative">
                  <select
                    id="filter-mode"
                    name="mode"
                    aria-label="Filter internships by mode"
                    value={selectedMode}
                    onChange={e => setSelectedMode(e.target.value)}
                    className="pl-4 pr-8 py-3 rounded-xl border border-navy/15 focus:border-[#D93800] focus:outline-none bg-white text-navy text-sm font-medium appearance-none cursor-pointer"
                  >
                    {MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/50 pointer-events-none" aria-hidden="true" />
                </div>

                {/* Duration Select with Explicit Accessible Name */}
                <div className="relative">
                  <select
                    id="filter-duration"
                    name="duration"
                    aria-label="Filter internships by duration"
                    value={selectedDuration}
                    onChange={e => setSelectedDuration(e.target.value)}
                    className="pl-4 pr-8 py-3 rounded-xl border border-navy/15 focus:border-[#D93800] focus:outline-none bg-white text-navy text-sm font-medium appearance-none cursor-pointer"
                  >
                    {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/50 pointer-events-none" aria-hidden="true" />
                </div>

                {hasFilters && (
                  <button 
                    type="button"
                    onClick={clearFilters} 
                    className="px-4 py-3 text-sm font-bold text-navy/60 hover:text-[#B83200] flex items-center gap-1 transition-colors"
                  >
                    <X size={14} aria-hidden="true" /> Clear
                  </button>
                )}
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-navy/10 px-6">
                  <Search size={36} className="mx-auto text-navy/40 mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-navy mb-2">No Programs Found</h3>
                  <p className="text-navy/60 text-sm mb-4">Try adjusting your search or category filters.</p>
                  <button 
                    type="button"
                    onClick={clearFilters} 
                    className="px-6 py-2.5 bg-[#D93800] text-white rounded-full font-bold text-sm hover:bg-[#B83200] transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-5">
                  {filtered.map((intern, i) => {
                    const imgUrl = intern.image && intern.image !== '/images/internship.png'
                      ? (intern.image.startsWith('http') ? intern.image : `${API_URL}${intern.image}`)
                      : null;
                    return (
                      <motion.article
                        key={intern.id || i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i % 4) * 0.07 }}
                        className="bg-white rounded-2xl border border-navy/10 hover:border-[#D93800]/40 hover:shadow-lg transition-all group flex flex-col justify-between"
                      >
                        {/* Card Header */}
                        <div>
                          <div className="p-5 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl bg-[#D93800]/10 overflow-hidden">
                              {imgUrl ? (
                                <img src={imgUrl} alt={intern.title} className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <Briefcase size={22} className="text-[#B83200]" aria-hidden="true" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-navy text-base leading-tight mb-1.5 group-hover:text-[#D93800] transition-colors truncate">
                                {intern.title}
                              </h3>
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5">
                                {intern.category && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                    {intern.category}
                                  </span>
                                )}
                                {intern.mode && (
                                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {intern.mode}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="px-5 pb-4">
                            <p className="text-navy/70 text-sm leading-relaxed line-clamp-3 font-normal">{intern.description}</p>
                          </div>
                        </div>

                        <div>
                          {/* Meta */}
                          <div className="px-5 py-3 border-t border-navy/5 flex items-center gap-4 text-xs text-navy/70 font-medium">
                            {intern.duration && (
                              <span className="flex items-center gap-1"><Clock size={12} className="text-[#D93800]" aria-hidden="true" />{intern.duration}</span>
                            )}
                            {intern.location && (
                              <span className="flex items-center gap-1"><MapPin size={12} className="text-[#D93800]" aria-hidden="true" />{intern.location || intern.mode}</span>
                            )}
                            {intern.openings && (
                              <span className="flex items-center gap-1 text-navy font-bold">
                                {intern.openings} Openings
                              </span>
                            )}
                          </div>

                          {/* CTA - High Affordance Standard Button */}
                          <div className="px-5 pb-5">
                            <Link
                              to={`/internships/${intern.id}`}
                              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#D93800] hover:bg-[#B83200] text-white rounded-xl font-bold text-sm transition-all group/btn shadow-sm"
                            >
                              Apply Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-5">

              {/* Why Join EDIZO? — only from DB */}
              {whyJoin && Array.isArray(whyJoin) && whyJoin.length > 0 && (
                <div className="bg-white rounded-2xl border border-navy/10 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-navy mb-4">Why Join EDIZO?</h3>
                  <ul className="space-y-3">
                    {whyJoin.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-navy/80">
                        <CheckCircle2 size={16} className="text-[#D93800] shrink-0 mt-0.5" aria-hidden="true" />
                        {typeof item === 'string' ? item : item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Stats — only from DB */}
              {statsData && Array.isArray(statsData) && statsData.length > 0 && (
                <div className="bg-[#D93800] rounded-2xl p-6 shadow-sm text-white">
                  <div className="space-y-4">
                    {statsData.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white text-sm">
                          {i === 0 ? <Users size={16} /> : i === 1 ? <Rocket size={16} /> : i === 2 ? <CheckCircle2 size={16} /> : <Target size={16} />}
                        </div>
                        <div>
                          <p className="text-xl font-extrabold text-white leading-none">{s.value}</p>
                          <p className="text-white/90 text-xs font-medium">{s.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Our Internship Process — only from DB */}
              {processSteps && Array.isArray(processSteps) && processSteps.length > 0 && (
                <div className="bg-white rounded-2xl border border-navy/10 p-6 shadow-sm">
                  <h3 className="text-base font-bold text-navy mb-5">Our Internship Process</h3>
                  <div className="space-y-4">
                    {processSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#D93800] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-sm shadow-[#D93800]/30">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-navy">{typeof step === 'string' ? step : step.title}</p>
                          {typeof step === 'object' && step.desc && (
                            <p className="text-xs text-navy/60">{step.desc}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* =============================================
          TESTIMONIALS — only from DB
      ============================================= */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-white border-t border-navy/10">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-2xl font-display font-extrabold text-navy mb-8 text-center md:text-left">What Our Interns Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-grey-light rounded-2xl p-6 border border-navy/10 flex flex-col justify-between"
                >
                  <p className="text-navy/80 text-sm leading-relaxed mb-5 italic font-normal">"{t.content || t.text || t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D93800]/10 flex items-center justify-center text-[#B83200] font-bold text-sm shrink-0">
                      {t.author?.charAt(0) || t.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{t.author || t.name}</p>
                      <p className="text-xs text-navy/60">{t.role || t.program}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(t.rating || 5)].map((_, ri) => (
                        <Star key={ri} size={12} fill="currentColor" className="text-[#D93800]" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =============================================
          BOTTOM CTA
      ============================================= */}
      <section className="py-14 bg-navy relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-orange/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-2">Ready to Start?</p>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white leading-tight">
                Take the First Step Towards Your{' '}
                <span className="text-[#FF855C]">Dream Career</span>
              </h2>
              <p className="text-white/75 mt-2 max-w-lg text-sm md:text-base font-normal">
                {pageData?.sections?.ctaSubtitle || 'Join hundreds of successful interns who have started their journey with EDIZO.'}
              </p>
            </div>
            <div className="flex gap-4 flex-wrap shrink-0">
              <Link 
                to="/register" 
                className="px-7 py-3.5 bg-[#D93800] text-white font-bold rounded-full hover:bg-[#B83200] transition-all inline-flex items-center gap-2 shadow-lg shadow-[#D93800]/30 hover:-translate-y-0.5 text-sm"
              >
                Apply Now <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link 
                to="/contact" 
                className="px-7 py-3.5 bg-white/10 border border-white/25 text-white font-bold rounded-full hover:bg-white/20 transition-all hover:-translate-y-0.5 text-sm"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default InternshipsPage;
