import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Code2, GraduationCap, Laptop, Smartphone, Palette, Video, Search, Shield } from 'lucide-react';
import SpotlightCard from '../ui/SpotlightCard';
import ShinyText from '../ui/ShinyText';

const getServiceIcon = (title) => {
  const t = (title || '').toLowerCase();
  if (t.includes('web')) return Laptop;
  if (t.includes('app') || t.includes('mobile')) return Smartphone;
  if (t.includes('graphic') || t.includes('design') || t.includes('ui')) return Palette;
  if (t.includes('video') || t.includes('media')) return Video;
  if (t.includes('seo') || t.includes('market')) return Search;
  if (t.includes('intern')) return GraduationCap;
  return Code2;
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(Array.isArray(data) ? data : []);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to load home services", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [API_URL]);

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

  const getFallbackServiceImage = (title) => {
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

  if (loading) {
    return (
      <section className="py-20 bg-[#F8F9FA] dark:bg-[#060B13]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-white dark:bg-[#0B132B] rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-[#F8F9FA] dark:bg-[#060B13] transition-colors duration-500 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Structured Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5 pb-5 border-b border-navy/10 dark:border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <ShinyText text="Core Engineering Capabilities & Programs" />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.1] tracking-tight"
            >
              Enterprise Software & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                Digital Engineering Services.
              </span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-navy/15 dark:border-white/15 text-navy dark:text-white font-bold text-xs uppercase tracking-wider hover:border-orange hover:text-orange dark:hover:border-orange dark:hover:text-orange transition-all duration-200 group shrink-0"
            >
              All Services
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/internships"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white font-bold text-xs uppercase tracking-wider hover:shadow-md hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all duration-200 group shrink-0"
            >
              Internship Tracks
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Clean, Uniform 3-Column Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {services.map((service, idx) => {
            const features = parseFeatures(service.features).slice(0, 4);
            const Icon = getServiceIcon(service.title);

            const imgSrc = service.image_url
              ? (service.image_url.startsWith('http') ? service.image_url : `${API_URL}${service.image_url}`)
              : getFallbackServiceImage(service.title);

            const isInternship = (service.category || '').toLowerCase().includes('intern') ||
                                 (service.title || '').toLowerCase().includes('intern');
            const targetUrl = isInternship ? '/internships' : `/services/${service.id}`;

            return (
              <motion.div
                key={service.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="flex"
              >
                <SpotlightCard className="w-full p-7 flex flex-col justify-between bg-white dark:bg-[#0B132B] border-navy/10 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                  
                  {/* Top Header & Icon Row */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-orange/15 text-[#D93800] dark:text-[#FF855C] flex items-center justify-center font-bold">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-navy/40 dark:text-white/40">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Category Label */}
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#D93800] dark:text-[#FF855C] mb-1.5">
                      {service.category || (isInternship ? 'Tech Internship' : 'Digital Solution')}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-extrabold text-navy dark:text-white mb-2.5 leading-snug">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-navy/70 dark:text-white/70 font-medium leading-relaxed mb-5 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Visual Thumbnail */}
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 mb-5 border border-navy/5 dark:border-white/5 flex items-center justify-center shadow-xs">
                      <img
                        src={imgSrc}
                        alt={service.title}
                        width="320"
                        height="180"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const fallback = getFallbackServiceImage(service.title);
                          if (e.target.src !== fallback) {
                            e.target.src = fallback;
                          }
                        }}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* 4 Feature Checklist Points */}
                    {features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-orange/15 text-[#D93800] dark:text-[#FF855C] flex items-center justify-center shrink-0">
                              <Check size={9} strokeWidth={3.5} />
                            </div>
                            <span className="text-xs font-semibold text-navy/80 dark:text-white/80 line-clamp-1">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-4 border-t border-navy/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-navy/60 dark:text-white/60">
                      {isInternship ? 'Live Training' : 'Production Ready'}
                    </span>
                    <Link
                      to={targetUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D93800] dark:text-[#FF855C] hover:text-[#C43802] dark:hover:text-white group/btn"
                    >
                      <span>{isInternship ? 'Explore Track' : 'View Service'}</span>
                      <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
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

export default Services;
