import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Services = () => {
  const [activeService, setActiveService] = useState(0);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/services`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setServicesList(data);
          } else {
            // Fallback hardcoded if empty
            setServicesList([
              {
                title: "Web Development",
                description: "High-performance, scalable web applications built with modern frameworks like React, Next.js, and Node.js.",
                features: ["Custom SaaS Platforms", "E-commerce Solutions", "Progressive Web Apps (PWAs)"]
              },
              {
                title: "Mobile App Development",
                description: "Native and cross-platform mobile experiences that users love, engineered for speed and reliability.",
                features: ["iOS & Android Apps", "Flutter & React Native", "App Store Optimization"]
              },
              {
                title: "UI/UX Design",
                description: "Data-driven, user-centric design that converts. We build intuitive interfaces with stunning aesthetics.",
                features: ["Wireframing & Prototyping", "Design Systems", "User Testing"]
              },
              {
                title: "AI Integration",
                description: "Empower your business with intelligent automation, machine learning models, and smart AI agents.",
                features: ["Custom LLM Integration", "Predictive Analytics", "Process Automation"]
              }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return null;

  return (
    <section id="services" className="py-24 bg-grey-light relative">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our <span className="text-gradient">Service Ecosystem</span>
          </h2>
          <p className="text-xl text-grey-medium max-w-2xl">
            Comprehensive digital solutions tailored to elevate your business in the modern landscape.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Services List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {servicesList.map((service, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${activeService === index ? 'bg-orange text-white shadow-xl scale-105 transform origin-left z-10' : 'premium-card text-grey-dark'}`}
                onClick={() => setActiveService(index)}
                whileHover={activeService !== index ? { x: 10 } : {}}
              >
                <h3 className={`text-2xl font-bold ${activeService === index ? 'text-white' : 'text-grey-dark'}`}>
                  {service.title}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Service Details Canvas */}
          <div className="lg:col-span-7 relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 glass p-10 md:p-14 rounded-3xl flex flex-col justify-center border-t border-l border-white/50 bg-gradient-to-br from-white/80 to-white/40"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange/10 mb-8 flex items-center justify-center">
                   <span className="text-3xl font-bold text-orange">0{activeService + 1}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-display font-bold text-grey-dark mb-6">
                  {servicesList[activeService].title}
                </h3>
                
                <p className="text-xl text-grey-medium mb-10 leading-relaxed">
                  {servicesList[activeService].description}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {servicesList[activeService].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-grey-dark font-medium bg-white/60 p-3 rounded-lg border border-white/40">
                      <div className="w-2 h-2 rounded-full bg-orange" />
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
