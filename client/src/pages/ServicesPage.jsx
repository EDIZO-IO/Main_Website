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
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
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

  return (
    <div className="pt-32 pb-24 bg-grey-light min-h-screen">
      <Helmet>
        <title>Our Services - EDIZO</title>
        <meta name="description" content="EDIZO offers a complete suite of digital services designed to help your brand look great, function flawlessly, and reach the right audience." />
      </Helmet>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl font-display font-bold mb-6">
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-grey-medium">
            EDIZO offers a complete suite of digital services designed to help your brand look great, function flawlessly, and reach the right audience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card rounded-3xl p-8 group flex flex-col h-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange/10 mb-6 flex items-center justify-center text-orange font-bold text-2xl group-hover:bg-orange group-hover:text-white transition-colors">
                0{index + 1}
              </div>
              <h3 className="text-2xl font-bold text-grey-dark mb-4 group-hover:text-orange transition-colors">
                {service.title}
              </h3>
              <p className="text-grey-medium mb-8 flex-grow">
                {service.description}
              </p>
              <Link 
                to={`/services/${service.id}`}
                className="inline-flex items-center text-orange font-bold hover:gap-2 transition-all"
              >
                View Details &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
