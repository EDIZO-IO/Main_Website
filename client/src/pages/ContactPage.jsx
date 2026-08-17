import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Navigation, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const ContactPage = () => {
  const { settings: config } = useSite();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/pages/contact`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch contact page data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const heroContent = pageData?.sections?.hero 
    ? (typeof pageData.sections.hero === 'string' ? JSON.parse(pageData.sections.hero) : pageData.sections.hero) 
    : { title: "", subtitle: "" };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-grey-light min-h-screen font-sans transition-colors duration-500 pb-24">
      <Helmet>
        <title>{pageData?.seo_title || "Contact Us - EDIZO"}</title>
        <meta name="description" content={pageData?.seo_description || "Get in touch with EDIZO. Have a project in mind? Reach out to us today."} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-navy pt-40 pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-orange/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div {...fadeIn}>
            <span className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-orange font-bold text-sm mb-8 tracking-wider uppercase backdrop-blur-sm">
              Contact Our Team
            </span>
            {heroContent.title && (
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
                {heroContent.title}
              </h1>
            )}
            {heroContent.subtitle && (
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                {heroContent.subtitle}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-6xl -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Contact Info */}
          <div className="w-full lg:w-5/12 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-grey-silver flex gap-6 items-start hover:-translate-y-1 transition-transform group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="text-orange" size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">Email Us</h3>
                <a href={`mailto:${config.email_1}`} className="text-grey-medium hover:text-orange transition-colors block">{config.email_1}</a>
                {config.email_2 && <a href={`mailto:${config.email_2}`} className="text-grey-medium hover:text-orange transition-colors block mt-1">{config.email_2}</a>}
                {config.email_3 && <a href={`mailto:${config.email_3}`} className="text-grey-medium hover:text-orange transition-colors block mt-1">{config.email_3}</a>}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-grey-silver flex gap-6 items-start hover:-translate-y-1 transition-transform group"
            >
              <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="text-navy" size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">Call Us</h3>
                <a href={`tel:${config.phone}`} className="font-medium text-grey-dark hover:text-orange transition-colors block">{config.phone}</a>
                {config.office_hours && <p className="text-grey-medium text-sm mt-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> {config.office_hours}</p>}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-grey-silver flex gap-6 items-start hover:-translate-y-1 transition-transform group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-xl mb-2">Our Headquarters</h3>
                <p className="font-medium text-grey-dark">{config.address_title}</p>
                <p className="text-grey-medium">{config.address_line1}</p>
                <p className="text-grey-medium">{config.address_line2}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-7/12 bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-grey-silver relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h2 className="text-3xl font-display font-bold text-navy mb-4">Send a message</h2>
            <p className="text-grey-medium mb-10 leading-relaxed">
              Have a specific inquiry? Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {status === 'success' && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 size={24} />
                <p className="font-medium">Thanks for contacting us! We'll be in touch soon.</p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-4">
                <AlertCircle size={24} />
                <p className="font-medium">Something went wrong. Please try again or contact us directly via email.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative group">
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full bg-grey-light border border-grey-silver px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy peer"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                    Full Name
                  </label>
                </div>
                <div className="relative group">
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full bg-grey-light border border-grey-silver px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy peer"
                    placeholder=" "
                  />
                  <label htmlFor="email" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                    Email Address
                  </label>
                </div>
              </div>

              <div className="relative group">
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full bg-grey-light border border-grey-silver px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy peer"
                  placeholder=" "
                />
                <label htmlFor="phone" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                  Phone Number
                </label>
              </div>

              <div className="relative group">
                <select 
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="block w-full bg-grey-light border border-grey-silver px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors appearance-none text-navy peer font-medium"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Website Development">Website Development</option>
                  <option value="App Development">App Development</option>
                  <option value="SEO">SEO & Digital Marketing</option>
                  <option value="API">API Solutions</option>
                  <option value="Internship">Internship & Workshops</option>
                </select>
                <label htmlFor="subject" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5">
                  Service Interested In
                </label>
              </div>

              <div className="relative group">
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="block w-full bg-grey-light border border-grey-silver px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors resize-none text-navy peer"
                  placeholder=" "
                ></textarea>
                <label htmlFor="message" className="absolute text-sm font-bold text-grey-medium duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                  Your Message
                </label>
              </div>

              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full px-8 py-5 bg-navy text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-navy/20 hover:-translate-y-1 active:translate-y-0 duration-200 uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Send Message <Send size={16} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
