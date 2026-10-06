import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, X, Check, ArrowRight, Sparkles, Layers } from 'lucide-react';
import TypewriterText from '../components/ui/TypewriterText';
import DecryptedText from '../components/ui/DecryptedText';

const ServicesPage = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          setServicesList(Array.isArray(data) ? data : []);
        } else {
          setServicesList([]);
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
        setServicesList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [API_URL]);

  // Parse features safely from DB row
  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return features.split('\n').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  // Filter live database services by search
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return servicesList;
    const q = searchQuery.toLowerCase();
    return servicesList.filter(s => {
      const title = (s.title || '').toLowerCase();
      const desc = (s.description || '').toLowerCase();
      const cat = (s.category || '').toLowerCase();
      const feats = parseFeatures(s.features).join(' ').toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q) || feats.includes(q);
    });
  }, [servicesList, searchQuery]);

  // Dynamic bento styling config per card index
  const getCardLayoutConfig = (index) => {
    // 7-card Bento pattern: 7/5 (row 1), 4/4/4 (row 2), 6/6 (row 3)
    const patterns = [
      { span: 'lg:col-span-7 col-span-12', isDark: false, glow: 'from-orange/20 via-orange/5 to-transparent' },
      { span: 'lg:col-span-5 col-span-12', isDark: false, glow: 'from-orange/15 to-transparent' },
      { span: 'lg:col-span-4 md:col-span-6 col-span-12', isDark: false, glow: 'from-red-500/15 to-transparent' },
      { span: 'lg:col-span-4 md:col-span-6 col-span-12', isDark: false, glow: 'from-purple-500/15 to-transparent' },
      { span: 'lg:col-span-4 md:col-span-12 col-span-12', isDark: true, glow: 'from-orange/30 via-red-500/20 to-transparent' },
      { span: 'lg:col-span-6 col-span-12', isDark: true, isNeon: true, glow: 'from-blue-600/30 via-cyan-500/20 to-transparent' },
      { span: 'lg:col-span-6 col-span-12', isDark: false, glow: 'from-orange/20 via-red-500/10 to-transparent' },
    ];
    return patterns[index % patterns.length];
  };

  // Fallback service illustration if DB image is not yet uploaded
  const getFallbackServiceImage = (title, index) => {
    const t = (title || '').toLowerCase();
    if (t.includes('web')) return '/images/services/web dev.png';
    if (t.includes('app') || t.includes('mobile')) return '/images/services/App development.png';
    if (t.includes('graphic') || t.includes('design')) return '/images/services/graphic design.png';
    if (t.includes('video') || t.includes('media')) return '/images/services/video editing.png';
    if (t.includes('seo') || t.includes('market')) return '/images/services/seo marketing.png';
    if (t.includes('api') || t.includes('tech') || t.includes('it')) return '/images/services/why edizo.png';
    if (t.includes('intern') || t.includes('train')) return '/images/services/internship.png';
    return '/images/digital_product_mockup.png';
  };

  return (
    <div className="pt-28 pb-24 bg-[#F8F9FA] dark:bg-[#050B14] min-h-screen font-sans transition-colors duration-500 overflow-x-hidden">
      <Helmet>
        <title>Our Services | Custom Web, Mobile & Software Solutions — EDIZO</title>
        <meta name="description" content="Explore EDIZO's live suite of digital services: custom web application development, mobile apps, UI/UX design, SEO marketing, and cloud API solutions." />
        <link rel="canonical" href="https://edizotech.in/services" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">

        {/* Compact Header */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-widest mb-3"
          >
            <Sparkles size={13} className="text-[#B83200] dark:text-[#FF855C]" />
            <TypewriterText 
              texts={[
                "Design • Develop • Deliver",
                "Full-Stack Web & SaaS",
                "Mobile Applications",
                "UI/UX & Brand Identity",
                "Cloud API & SEO Engineering"
              ]}
              typingSpeed={60}
              deletingSpeed={30}
              pauseDuration={2200}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-grey-dark dark:text-white leading-tight tracking-tight mb-3"
          >
            Digital Solutions That Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-dark">Results</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm md:text-base text-grey-medium leading-relaxed max-w-2xl mx-auto mb-6"
          >
            Explore our end-to-end technology and design capabilities built to scale your business.
          </motion.p>

          {/* Compact Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-md mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-medium" size={16} />
            <input
              type="text"
              id="services-search"
              aria-label="Search services"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-grey-silver dark:border-white/10 focus:border-orange focus:outline-none bg-white dark:bg-[#0A1120] text-grey-dark dark:text-white text-sm font-medium shadow-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-medium hover:text-orange transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-12 gap-5">
            <div className="lg:col-span-7 col-span-12 h-64 bg-white dark:bg-[#0A1120] rounded-2xl animate-pulse border border-grey-silver dark:border-white/10" />
            <div className="lg:col-span-5 col-span-12 h-64 bg-white dark:bg-[#0A1120] rounded-2xl animate-pulse border border-grey-silver dark:border-white/10" />
            <div className="lg:col-span-4 col-span-12 h-60 bg-white dark:bg-[#0A1120] rounded-2xl animate-pulse border border-grey-silver dark:border-white/10" />
            <div className="lg:col-span-4 col-span-12 h-60 bg-white dark:bg-[#0A1120] rounded-2xl animate-pulse border border-grey-silver dark:border-white/10" />
            <div className="lg:col-span-4 col-span-12 h-60 bg-white dark:bg-[#0A1120] rounded-2xl animate-pulse border border-grey-silver dark:border-white/10" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0A1120] rounded-2xl border border-grey-silver dark:border-white/10 p-8">
            <Search size={32} className="text-grey-medium mx-auto mb-3" />
            <h3 className="text-lg font-bold text-grey-dark dark:text-white mb-1">No services match "{searchQuery}"</h3>
            <p className="text-xs text-grey-medium mb-4">Try searching for Web, App, Design, SEO, or API.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2 bg-orange text-white rounded-full font-bold text-xs hover:bg-orange-dark transition-all"
            >
              Reset Search
            </button>
          </div>
        ) : (
          /* Sleek Bento Grid derived purely from live database services */
          <div className="grid grid-cols-12 gap-5 items-stretch">
            {filteredServices.map((service, idx) => {
              const layout = getCardLayoutConfig(idx);
              const isDark = layout.isDark;
              const isDarkNeon = layout.isNeon;
              const isSpecialDark = isDark || isDarkNeon;
              const features = parseFeatures(service.features).slice(0, 4);

              // Image URL resolution
              const imgSrc = service.image_url
                ? (service.image_url.startsWith('http') ? service.image_url : `${API_URL}${service.image_url}`)
                : getFallbackServiceImage(service.title, idx);

              // Target route
              const isInternship = (service.category || '').toLowerCase().includes('intern') ||
                                   (service.title || '').toLowerCase().includes('intern');
              const targetUrl = isInternship ? '/internships' : `/services/${service.id}`;

              // Title split into primary and highlight word
              const titleWords = (service.title || '').split(' ');
              const titlePrimary = titleWords.slice(0, -1).join(' ') || titleWords[0];
              const titleHighlight = titleWords.length > 1 ? titleWords[titleWords.length - 1] : '';

              return (
                <motion.div
                  key={service.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={`${layout.span} group relative rounded-2xl p-5 md:p-6 flex flex-col justify-between overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isDarkNeon
                      ? 'bg-[#070F26] border-cyan-500/20 text-white hover:border-cyan-400/40 hover:shadow-cyan-500/10'
                      : isDark
                      ? 'bg-[#0B132B] border-white/10 text-white hover:border-orange/40 hover:shadow-orange/10'
                      : 'bg-white dark:bg-[#0A1120] border-grey-silver dark:border-white/10 text-grey-dark dark:text-white shadow-sm hover:border-orange/30'
                  }`}
                >
                  {/* Subtle ambient radial background glow */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${layout.glow} rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    
                    {/* Details Column */}
                    <div className="md:col-span-7 col-span-12 flex flex-col justify-between h-full">
                      <div>
                        {/* Number & Category Badge */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-display font-bold text-[11px] ${
                            isSpecialDark
                              ? 'bg-white/10 text-white border border-white/15'
                              : 'bg-[#0B132B] text-white dark:bg-white dark:text-[#0B132B]'
                          }`}>
                            0{idx + 1}
                          </span>
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${
                            isSpecialDark ? 'text-white/60' : 'text-grey-medium'
                          }`}>
                            <DecryptedText text={service.category || 'Digital Service'} speed={30} trigger="hover" />
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg sm:text-xl font-display font-extrabold leading-tight tracking-tight mb-1.5">
                          <span className={isSpecialDark ? 'text-white' : 'text-[#0B132B] dark:text-white'}>
                            {titlePrimary}{' '}
                          </span>
                          {titleHighlight && (
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F]">
                              {titleHighlight}
                            </span>
                          )}
                        </h2>

                        {/* Description */}
                        <p className={`text-xs leading-relaxed line-clamp-2 mb-3.5 ${
                          isSpecialDark ? 'text-white/70' : 'text-grey-medium'
                        }`}>
                          {service.description}
                        </p>

                        {/* Compact 4-point Checklist */}
                        {features.length > 0 && (
                          <div className="space-y-1.5 mb-4">
                            {features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#FF3B30] to-[#FF5A1F] flex items-center justify-center text-white shrink-0 shadow-xs shadow-orange/30">
                                  <Check size={8} strokeWidth={3.5} />
                                </div>
                                <span className={`text-[11px] sm:text-xs font-medium line-clamp-1 ${
                                  isSpecialDark ? 'text-white/85' : 'text-grey-dark dark:text-grey-silver'
                                }`}>
                                  {feat}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Compact Action Button */}
                      <div className="pt-1">
                        <Link
                          to={targetUrl}
                          className="group/btn inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] hover:from-[#E02E24] hover:to-[#E04812] text-white font-bold text-[11px] uppercase tracking-wider shadow-sm hover:shadow-orange/40 hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                          {isInternship ? 'Explore Internships' : 'View Details'}
                          <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Compact Image Column */}
                    <div className="md:col-span-5 col-span-12 relative flex items-center justify-center">
                      <div className="relative w-full aspect-[4/3] max-h-36 md:max-h-44 rounded-xl overflow-hidden bg-grey-light/50 dark:bg-black/20 flex items-center justify-center border border-current/5">
                        <img
                          src={imgSrc}
                          alt={service.title}
                          width="320"
                          height="240"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const fallback = getFallbackServiceImage(service.title, idx);
                            if (e.target.src !== fallback) {
                              e.target.src = fallback;
                            }
                          }}
                          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md"
                        />
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-[#070F26] border border-white/10 rounded-2xl p-8 md:p-10 text-center relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange rounded-full mix-blend-screen filter blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3">
              Ready to transform your digital presence?
            </h2>
            <p className="text-white/80 text-xs md:text-sm mb-6 max-w-lg mx-auto">
              Partner with EDIZO to build custom websites, mobile applications, and scalable software solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] hover:from-[#E02E24] hover:to-[#E04812] text-white rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-md shadow-orange/30 hover:scale-105 active:scale-95 transition-all"
              >
                Start Your Project &rarr;
              </Link>
              <Link
                to="/projects"
                className="w-full sm:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5 transition-all"
              >
                View Client Showcase
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ServicesPage;
