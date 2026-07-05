import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ServiceDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/services/${id}`);
        if (!res.ok) throw new Error('Not found');
        const service = await res.json();
        setData(service);
      } catch (err) {
        console.error("Failed to fetch service details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
  }

  if (!data) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <h1 className="text-4xl font-bold">Service not found</h1>
        <Link to="/services" className="text-orange hover:underline mt-4 inline-block">Return to Services</Link>
      </div>
    );
  }

  const title = data.title || 'Service Details';

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/services" className="inline-flex items-center text-grey-medium hover:text-orange mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Services
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-display font-bold mb-6 text-grey-dark">
            {title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange to-orange-dark mb-10" />
          
          <div className="prose prose-lg text-grey-medium mb-16">
            <p className="text-xl leading-relaxed mb-6 whitespace-pre-wrap">
              {data.description || `We provide cutting-edge ${title.toLowerCase()} solutions tailored to your unique business needs.`}
            </p>
            
            {(data.category || data.price) && (
              <div className="flex gap-4 mb-6">
                {data.category && (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-grey-light text-grey-dark font-bold text-sm">
                    {data.category}
                  </span>
                )}
                {data.price && (
                  <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                    Starting from {data.price}
                  </span>
                )}
              </div>
            )}

            <h3 className="text-2xl font-bold text-grey-dark mt-10 mb-4">What we offer</h3>
            <ul className="list-disc pl-6 space-y-3 mb-8">
              {data.features ? (
                data.features.split(',').map((feat, idx) => (
                  <li key={idx}>{feat.trim()}</li>
                ))
              ) : (
                <>
                  <li>Customized Strategy and Planning</li>
                  <li>State-of-the-art Technology Implementation</li>
                  <li>Continuous Support and Maintenance</li>
                  <li>Scalable and Secure Architectures</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-grey-light p-10 rounded-3xl border border-grey-silver flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-grey-dark mb-2">Ready to get started?</h3>
              <p className="text-grey-medium">Request this service and we'll get back to you within 24 hours.</p>
            </div>
            {isAuthenticated ? (
              <Link to="/contact" className="px-8 py-4 bg-orange text-white font-bold rounded-full hover:bg-orange-dark transition-colors shadow-lg shrink-0">
                Request Service
              </Link>
            ) : (
              <Link to="/login" className="px-8 py-4 bg-grey-dark text-white font-bold rounded-full hover:bg-grey-medium transition-colors shadow-lg shrink-0">
                Login to Request
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetails;
