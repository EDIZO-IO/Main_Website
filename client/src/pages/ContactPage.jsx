import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Navigation } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const ContactPage = () => {
  const { settings: config } = useSite();
  const [pageData, setPageData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/pages/contact`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch contact page data", err);
      }
    };
    fetchPageData();
  }, []);

  const heroContent = pageData?.sections?.hero 
    ? (typeof pageData.sections.hero === 'string' ? JSON.parse(pageData.sections.hero) : pageData.sections.hero) 
    : {
    title: "Let's Start a Conversation",
    subtitle: "Have a project in mind, a question about our services, or want to apply for an internship? Reach out to us — we'd love to hear from you."
  };

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
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Thanks for contacting us! We'll be in touch soon.");
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Server error.");
    }
  };

  return (
    <div className="pt-32 pb-32 bg-[#F8FAFC] min-h-screen font-sans">
      <Helmet>
        <title>Contact Us - EDIZO</title>
        <meta name="description" content="Get in touch with EDIZO. Have a project in mind, a question about our services, or want to apply for an internship? Reach out to us today." />
      </Helmet>
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div {...fadeIn}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-sm mb-6">
              Contact Our Team
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-grey-dark mb-6 tracking-tight">
              {heroContent.title}
            </h1>
            <p className="text-xl text-grey-medium leading-relaxed">
              {heroContent.subtitle}
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Contact Info */}
          <div className="w-full lg:w-5/12 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow"
            >
              <div className="mt-1">
                <Mail className="text-orange" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-grey-dark text-lg mb-2">Email Us</h3>
                <p className="text-grey-medium">{config.email_1}</p>
                {config.email_2 && <p className="text-grey-medium">{config.email_2}</p>}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow"
            >
              <div className="mt-1">
                <Phone className="text-orange" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-grey-dark text-lg mb-2">Call Us</h3>
                <p className="font-medium text-grey-dark">{config.phone}</p>
                {config.office_hours && <p className="text-grey-medium text-sm mt-1">{config.office_hours}</p>}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex gap-4 items-start hover:shadow-md transition-shadow"
            >
              <div className="mt-1">
                <MapPin className="text-orange" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-grey-dark text-lg mb-2">Our Headquarters</h3>
                <p className="font-medium text-grey-dark">{config.address_title}</p>
                <p className="text-grey-medium">{config.address_line1}</p>
                <p className="text-grey-medium">{config.address_line2}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-sm h-64 border border-gray-100 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
                alt="Headquarters" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button className="absolute bottom-6 left-6 px-4 py-2 bg-white text-grey-dark rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange hover:text-white transition-colors shadow-lg">
                <Navigation size={16} /> Get Directions
              </button>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-7/12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-grey-dark mb-2">Send a message</h2>
            <p className="text-grey-medium mb-8">
              Have a specific inquiry? Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    required
                    className="w-full bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-grey-dark">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    required
                    className="w-full bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91-XXXXXXXXXX" 
                  className="w-full bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark">Service Interested In</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-colors appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Graphic Design</option>
                  <option>Video Editing</option>
                  <option>Website Development</option>
                  <option>App Development</option>
                  <option>SEO</option>
                  <option>API</option>
                  <option>Digital Marketing</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-grey-dark">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..." 
                  rows="5"
                  required
                  className="w-full bg-[#F8FAFC] border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="px-8 py-3.5 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition-colors shadow-lg shadow-orange/20 hover:-translate-y-0.5 active:translate-y-0 duration-200"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
