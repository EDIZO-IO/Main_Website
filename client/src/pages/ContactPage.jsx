import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
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
    message: '',
    consent: true
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Log DPDP consent asynchronously
      if (formData.consent) {
        fetch(`${API_URL}/api/user/consent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, consent_type: 'contact_privacy_policy', granted: true })
        }).catch(() => {});
      }

      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '', consent: true });
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
              Contact EDIZO
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white mb-8 tracking-tight">
              {heroContent?.title || "Let's Build Something Extraordinary"}
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              {heroContent?.subtitle || "Have a project in mind, need tech consultation, or want to join our internship program? Reach out to our team."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="-mt-16 container mx-auto px-6 max-w-7xl relative z-20">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <motion.div {...fadeIn} className="lg:col-span-5 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-grey-silver shadow-sm hover:shadow-xl transition-shadow">
              <h2 className="text-2xl font-display font-bold text-navy mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-grey-medium uppercase tracking-wider mb-1">Email Us</h3>
                    <a href={`mailto:${config.email_1 || 'contact@edizo.in'}`} className="text-base font-bold text-navy hover:text-orange transition-colors">
                      {config.email_1 || 'contact@edizo.in'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-grey-medium uppercase tracking-wider mb-1">Call Us</h3>
                    <a href={`tel:${config.phone || '+91 98765 43210'}`} className="text-base font-bold text-navy hover:text-orange transition-colors">
                      {config.phone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-grey-medium uppercase tracking-wider mb-1">{config.address_title || 'Headquarters'}</h3>
                    <p className="text-base font-bold text-navy">
                      {config.address_line1 || 'Edizo Tech Solutions'}<br />
                      <span className="text-sm font-normal text-grey-dark">{config.address_line2 || 'Bengaluru, Karnataka, India'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div {...fadeIn} className="lg:col-span-7">
            <div className="bg-white p-10 rounded-[2.5rem] border border-grey-silver shadow-sm relative overflow-hidden">
              <h2 className="text-3xl font-display font-bold text-navy mb-8">Send Us a Message</h2>

              {status === 'success' && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-medium">
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  Your message has been sent successfully! Our team will get back to you shortly.
                </div>
              )}

              {status === 'error' && (
                <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 font-medium">
                  <AlertCircle size={24} className="text-red-600 shrink-0" />
                  Failed to send message. Please try again or email us directly.
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

                {/* DPDP Privacy Consent */}
                <div className="flex items-center gap-3 text-xs text-grey-dark pt-2">
                  <input 
                    type="checkbox" 
                    id="consent" 
                    name="consent" 
                    checked={formData.consent} 
                    onChange={handleChange}
                    className="rounded border-grey-silver text-orange focus:ring-orange w-4 h-4 cursor-pointer" 
                  />
                  <label htmlFor="consent" className="flex items-center gap-1 cursor-pointer">
                    <ShieldCheck size={14} className="text-orange shrink-0" />
                    I consent to EDIZO processing my data under the Digital Personal Data Protection (DPDP) Act 2023.
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-5 bg-orange text-white rounded-2xl font-bold hover:bg-orange-dark transition-all duration-300 shadow-lg shadow-orange/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    'Sending Message...'
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
