import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ServicesPage = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        setServicesList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading services...</div>;
  }

  const getBentoConfig = (index, service) => {
    const pattern = index % 5;
    const imageUrl = service?.image_url ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${service.image_url}` : null;
    
    // Helper to safely render image without heavy overlays so the uploaded poster is clear
    const renderImage = (className) => {
      if (imageUrl) {
        return (
          <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
            <img 
              src={imageUrl} 
              alt={service.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition-colors duration-500"></div>
          </div>
        );
      }
      return null;
    };

    // If an image is uploaded, we override the background and colors for ALL patterns
    // so the image is fully visible and the text is legible.
    if (imageUrl) {
      return {
        span: pattern === 0 ? "md:col-span-2 md:row-span-2" : pattern === 3 ? "md:col-span-2 row-span-1" : "col-span-1 row-span-1",
        bg: "bg-black",
        text: "text-transparent", // Hide HTML text to prevent clashing with poster text
        textSecondary: "text-transparent",
        border: "border-transparent",
        iconColor: "text-white",
        buttonBg: "bg-orange text-white hover:bg-white hover:text-orange shadow-orange/30",
        visual: renderImage("rounded-[2.5rem]")
      };
    }

    switch (pattern) {
      case 0:
        return {
          span: "md:col-span-2 md:row-span-2",
          bg: "bg-white",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-white hover:text-orange shadow-orange/30",
          visual: (
            <div className="absolute -bottom-10 -right-10 w-2/3 h-2/3 bg-grey-light rounded-tl-3xl border-t border-l border-grey-silver flex flex-col p-6 shadow-2xl transition-transform duration-700 group-hover:-translate-y-6 group-hover:-translate-x-6 z-0">
              <div className="w-full h-8 bg-white rounded-lg mb-4 flex items-center px-4 gap-2 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-xl p-4 grid grid-cols-2 gap-4 shadow-sm">
                 <div className="bg-orange/10 rounded-lg"></div>
                 <div className="bg-blue-500/10 rounded-lg"></div>
              </div>
            </div>
          )
        };
      case 1:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-orange",
          text: "text-white",
          textSecondary: "text-white/80",
          border: "border-orange-dark",
          iconColor: "text-white",
          buttonBg: "bg-white text-orange hover:bg-navy hover:text-white shadow-black/10",
          visual: (
             <div className="absolute -bottom-8 -right-8 w-48 h-64 bg-white/10 backdrop-blur-md rounded-[2rem] border-[4px] border-white/20 p-4 transition-transform duration-500 group-hover:-rotate-12 group-hover:-translate-y-4 z-0">
               <div className="w-12 h-2 bg-white/30 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-md"></div>
               <div className="w-full h-1/3 bg-white/20 rounded-xl mt-4"></div>
             </div>
          )
        };
      case 2:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-navy",
          text: "text-white",
          textSecondary: "text-white/70",
          border: "border-navy-light",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-white hover:text-navy shadow-black/20",
          visual: (
             <div className="absolute top-1/2 right-4 -translate-y-1/2 w-32 h-32 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-45 z-0 opacity-50">
               <div className="absolute inset-0 border border-white/20 rounded-full"></div>
               <div className="absolute inset-4 border border-dashed border-white/40 rounded-full"></div>
               <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange rounded-full"></div>
             </div>
          )
        };
      case 3:
        return {
          span: "md:col-span-2 row-span-1",
          bg: "bg-white",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-navy text-white hover:bg-orange shadow-orange/30",
          visual: (
             <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange/5 to-transparent z-0 opacity-50 transition-opacity group-hover:opacity-100"></div>
          )
        };
      case 4:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-grey-light",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-orange text-white hover:bg-navy shadow-orange/20",
          visual: (
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange/10 rounded-full blur-2xl z-0 transition-transform group-hover:scale-150"></div>
          )
        };
      default:
        return {
          span: "col-span-1 row-span-1",
          bg: "bg-white",
          text: "text-grey-dark",
          textSecondary: "text-grey-medium",
          border: "border-grey-silver",
          iconColor: "text-orange",
          buttonBg: "bg-navy text-white hover:bg-orange shadow-orange/30",
          visual: null
        };
    }
  };

  return (
    <div className="pt-32 pb-32 bg-grey-light min-h-screen transition-colors duration-500 font-sans">
      <Helmet>
        <title>Our Services - EDIZO</title>
        <meta name="description" content="EDIZO offers a complete suite of digital services designed to help your brand look great, function flawlessly, and reach the right audience." />
      </Helmet>
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-6 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange font-bold text-sm mb-8 tracking-wider uppercase"
          >
            What We Do
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-extrabold mb-8 text-grey-dark leading-[1.1] tracking-tight"
          >
            Digital Solutions That Drive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-dark">Results</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-grey-medium leading-relaxed max-w-3xl mx-auto"
          >
            EDIZO offers a complete suite of premium digital services designed to help your brand look great, function flawlessly, and reach the right audience.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {servicesList.map((service, index) => {
            const conf = getBentoConfig(index, service);
            return (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 3) * 0.1 }}
                className={`${conf.span} ${conf.bg} ${conf.border} rounded-[2.5rem] p-8 group flex flex-col h-full relative overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
              >
                {conf.visual}
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl backdrop-blur-md border shadow-sm ${index % 5 === 1 || index % 5 === 2 ? 'bg-white/10 text-white border-white/20' : 'bg-grey-light text-grey-dark border-grey-silver'}`}>
                      0{index + 1}
                    </div>
                  </div>

                  <h3 className={`text-2xl md:text-3xl font-display font-bold leading-tight mb-4 group-hover:-translate-y-1 transition-transform ${conf.text}`}>
                    {service.title}
                  </h3>
                  
                  <p className={`line-clamp-3 mb-6 ${conf.textSecondary}`}>
                    {service.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-current/10 flex items-center justify-between">
                    <Link 
                      to={`/services/${service.id}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-md hover:-translate-y-1 ${conf.buttonBg}`}
                    >
                      View Details 
                      <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-[#0a1128] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-6">
              Ready to transform your digital presence?
            </h2>
            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
              Let's work together to create solutions that not only look beautiful but drive real business results.
            </p>
            <Link to="/contact" className="px-8 py-4 bg-orange text-white rounded-full font-bold hover:bg-[#e04f1a] transition-all text-sm tracking-wider uppercase inline-flex items-center justify-center gap-2 shadow-lg shadow-orange/20">
              Start Your Project &rarr;
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ServicesPage;
