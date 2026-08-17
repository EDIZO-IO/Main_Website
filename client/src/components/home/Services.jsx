import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Bento grid layout styles
const bentoConfigs = [
  {
    span: 'lg:col-span-2 lg:row-span-2',
    height: 'h-[400px] lg:h-[600px]',
    bg: 'bg-white dark:bg-navy-light',
    visual: (
      <div className="absolute -bottom-10 -right-10 w-3/4 h-3/4 bg-grey-light dark:bg-navy rounded-tl-3xl border-t border-l border-navy/10 flex flex-col p-6 shadow-2xl transition-transform duration-700 group-hover:-translate-y-10 group-hover:-translate-x-10">
        <div className="w-full h-8 bg-white dark:bg-navy-light rounded-lg mb-4 flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white dark:bg-navy-light rounded-xl p-4 grid grid-cols-2 gap-4">
           <div className="bg-orange/10 rounded-lg"></div>
           <div className="bg-blue-500/10 rounded-lg"></div>
        </div>
      </div>
    )
  },
  {
    span: 'lg:col-span-1 lg:row-span-1',
    height: 'h-[300px]',
    bg: 'bg-orange text-white',
    visual: (
      <div className="absolute -bottom-8 -right-8 w-48 h-64 bg-white/10 backdrop-blur-md rounded-[2rem] border-[4px] border-white/20 p-4 transition-transform duration-500 group-hover:-rotate-12 group-hover:-translate-y-4">
        <div className="w-12 h-2 bg-white/30 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md"></div>
        <div className="w-full h-1/3 bg-white/20 rounded-xl mt-4"></div>
      </div>
    )
  },
  {
    span: 'lg:col-span-1 lg:row-span-1',
    height: 'h-[300px]',
    bg: 'bg-navy text-white',
    visual: (
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-45">
        <div className="absolute inset-0 border border-white/20 rounded-full"></div>
        <div className="absolute inset-4 border border-dashed border-white/40 rounded-full"></div>
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange rounded-full"></div>
      </div>
    )
  },
  {
    span: 'lg:col-span-1 lg:row-span-1',
    height: 'h-[300px]',
    bg: 'bg-white dark:bg-navy-light',
    visual: (
      <div className="absolute top-1/2 right-10 -translate-y-1/2 flex gap-2 transition-transform duration-500 group-hover:scale-110">
        <div className="w-12 h-32 bg-navy/5 rounded-xl flex flex-col gap-2 p-2"><div className="w-full flex-1 bg-navy/10 rounded"></div></div>
        <div className="w-12 h-32 bg-orange/10 rounded-xl flex flex-col gap-2 p-2 mt-4"><div className="w-full flex-1 bg-orange/20 rounded"></div></div>
      </div>
    )
  },
  {
    span: 'lg:col-span-2 lg:row-span-1',
    height: 'h-[300px]',
    bg: 'bg-grey-light dark:bg-navy',
    visual: (
      <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity duration-700">
         <div className="w-[200px] h-[200px] border border-navy/20 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center">
           <div className="w-[150px] h-[150px] border border-dashed border-orange/40 rounded-full flex items-center justify-center animate-[spin_5s_linear_infinite_reverse]">
              <div className="font-display font-bold text-orange">AI</div>
           </div>
         </div>
      </div>
    )
  }
];

const Services = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/services`);
        if (response.ok) {
          const data = await response.json();
          setServices(Array.isArray(data) ? data.slice(0, 5) : []);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch services from API:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
     return (
       <section className="py-24 bg-white dark:bg-navy">
         <div className="container mx-auto px-6">
           <div className="mb-16 max-w-2xl">
             <div className="h-12 md:h-16 w-3/4 bg-grey-light dark:bg-navy-light rounded-2xl animate-pulse mb-4"></div>
             <div className="h-12 md:h-16 w-1/2 bg-grey-light dark:bg-navy-light rounded-2xl animate-pulse"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
             <div className="lg:col-span-2 lg:row-span-2 h-[400px] lg:h-[600px] bg-grey-light dark:bg-navy-light rounded-[3rem] animate-pulse"></div>
             <div className="lg:col-span-1 lg:row-span-1 h-[300px] bg-grey-light dark:bg-navy-light rounded-[3rem] animate-pulse"></div>
             <div className="lg:col-span-1 lg:row-span-1 h-[300px] bg-grey-light dark:bg-navy-light rounded-[3rem] animate-pulse"></div>
           </div>
         </div>
       </section>
     );
  }

  return (
    <section className="py-24 bg-white dark:bg-navy">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.1] tracking-tight"
          >
            Everything you need <br/> to build digital.
          </motion.h2>
        </div>

        {/* BENTO GRID */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-min">
            {services.map((service, idx) => {
              const config = bentoConfigs[idx % bentoConfigs.length];
              const displayId = `0${idx + 1}`;
              return (
              <motion.div 
                key={service.id || displayId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredId(displayId)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/services/${service.id || ''}`)}
                className={`premium-card p-6 flex flex-col relative overflow-hidden group cursor-pointer ${config.span} ${config.height} ${config.bg}`}
              >
                
                <div className="flex justify-between items-start mb-auto relative z-10">
                  <span className={`text-sm font-display font-bold transition-colors ${config.bg.includes('text-white') ? 'text-white/50 group-hover:text-white' : 'text-navy/30 group-hover:text-orange'}`}>
                    {displayId}
                  </span>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredId === displayId ? 'bg-orange text-white rotate-[-45deg]' : 'bg-transparent border border-current opacity-20'}`}>
                    <ArrowRight size={18} />
                  </div>
                </div>
                
                {service.image_url ? (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl md:rounded-[2.5rem]">
                    <img 
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${service.image_url}`} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500"></div>
                  </div>
                ) : (
                  config.visual
                )}

                <div className="relative z-10 mt-auto w-2/3">
                  <h3 className={`text-xl lg:text-2xl font-display font-bold mb-4 ${service.image_url ? 'text-white font-extrabold shadow-sm' : ''}`}>{service.title}</h3>
                  <p className={`font-medium leading-relaxed ${service.image_url ? 'text-white/90' : config.bg.includes('text-white') ? 'text-white/80' : 'text-navy/60 dark:text-white/60'}`}>{service.description}</p>
                </div>
                
                {/* Expand Detail Overlay */}
                <div className={`absolute inset-0 bg-navy text-white p-8 flex flex-col justify-between transition-transform duration-500 z-20 ${hoveredId === displayId ? 'translate-y-0' : 'translate-y-full'}`}>
                   <div>
                      <h4 className="text-xl font-display font-bold text-orange mb-4">{service.title}</h4>
                      <p className="text-white/70 font-medium">Click to explore our process, technologies, and case studies related to {service.title.toLowerCase()}.</p>
                   </div>
                   <Link to={`/services/${service.id || ''}`} className="text-white font-bold flex items-center gap-2 hover:text-orange transition-colors">
                      EXPLORE <ArrowRight size={18} />
                   </Link>
                </div>

              </motion.div>
            )})}
          </div>
        ) : (
          <div className="text-center py-16 bg-grey-light dark:bg-navy-light rounded-3xl border border-navy/5">
            <Layers size={36} className="mx-auto text-orange mb-3" />
            <h3 className="text-xl font-bold text-navy dark:text-white">Services Loading</h3>
            <p className="text-grey-medium text-sm mt-1">Services catalog is synced dynamically from database.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Services;
