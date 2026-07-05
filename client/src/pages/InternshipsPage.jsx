import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, Clock, MapPin, Building2, ChevronRight } from 'lucide-react';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {  
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/internships`);
        const data = await res.json();
        setInternships(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch internships", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading internships...</div>;
  }

  return (
    <div className="pt-32 pb-24 bg-grey-light min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Internships - EDIZO</title>
        <meta name="description" content="Kickstart your career with hands-on internship programs at EDIZO. Gain real industry experience in design, development, and marketing." />
      </Helmet>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-dark/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-2 rounded-full bg-orange/10 text-orange font-bold text-sm mb-6 uppercase tracking-wider shadow-sm border border-orange/20"
          >
            Edizo Academy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6 text-grey-dark"
          >
            Kickstart Your Career with <span className="text-gradient">EDIZO Internships</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-grey-medium"
          >
            EDIZO offers hands-on internship programs designed to give students and freshers real industry experience. Work on live projects, learn from experienced mentors, and build a portfolio that gets you hired.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-orange text-xl mb-3">Why Intern at EDIZO</h3>
            <ul className="text-grey-medium text-sm space-y-2 text-left list-disc list-inside">
              <li>Real client projects, not just theory</li>
              <li>Certificate of Internship</li>
              <li>Letter of Recommendation</li>
              <li>Mentorship from industry professionals</li>
              <li>Pre-Placement Offer (PPO) opportunities</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-orange text-xl mb-3">Eligibility</h3>
            <ul className="text-grey-medium text-sm space-y-2 text-left list-disc list-inside">
              <li>Students pursuing a degree/diploma</li>
              <li>Basic knowledge in the chosen domain</li>
              <li>Laptop and stable internet</li>
              <li>Willingness to learn</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-orange text-xl mb-3">Duration & Modes</h3>
            <p className="text-grey-medium text-sm text-left">
              Flexible durations available: <strong>15 Days, 1 Month, 2 Months, and 3 Months</strong> programs.<br/><br/>
              Flexible remote and hybrid working options to suit your schedule.
            </p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {internships.map((internship) => (
            <motion.div 
              key={internship.id}
              variants={itemVariants}
              className="premium-card rounded-[2rem] p-8 group flex flex-col h-full relative overflow-hidden"
            >
              {/* Category Badge */}
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-grey-light rounded-full text-xs font-bold text-grey-dark group-hover:bg-orange/10 group-hover:text-orange transition-colors">
                  {internship.category}
                </span>
              </div>

              {/* Title & Rating */}
              <div className="mb-6 mt-2">
                <h3 className="text-2xl font-display font-bold text-grey-dark group-hover:text-orange transition-colors pr-20 line-clamp-2">
                  {internship.title}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="text-sm font-bold text-grey-dark ml-1">{internship.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-grey-medium mb-8 line-clamp-3 flex-grow">
                {internship.description}
              </p>

              {/* Meta info */}
              <div className="space-y-3 mb-8 pb-8 border-b border-grey-silver/50">
                <div className="flex items-center gap-3 text-grey-dark text-sm font-medium">
                  <Building2 size={18} className="text-orange" />
                  {internship.company}
                </div>
                <div className="flex items-center gap-3 text-grey-dark text-sm font-medium">
                  <Clock size={18} className="text-orange" />
                  {internship.duration || 'Flexible: 15 Days - 3 Months'}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-grey-dark text-sm font-medium">
                    <MapPin size={18} className="text-orange" />
                    {internship.mode}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-orange">
                      {internship.price === '0' || !internship.price ? 'Free' : `₹${internship.price}`}
                    </span>
                    {internship.stipend && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md mt-1">
                        Stipend: {internship.stipend}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link 
                to={`/internships/${internship.id}`}
                className="w-full flex items-center justify-between px-6 py-4 bg-grey-light border border-grey-silver rounded-2xl text-grey-dark font-bold group-hover:bg-orange group-hover:text-white group-hover:border-orange transition-all"
              >
                View Program Details
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InternshipsPage;
