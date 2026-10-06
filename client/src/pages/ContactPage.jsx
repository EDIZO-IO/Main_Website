import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle,
  ShieldCheck, Clock, MessageCircle, Globe, Sparkles
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '../components/SocialIcons';
import { useSite } from '../context/SiteContext';
import TypewriterText from '../components/ui/TypewriterText';
import DecryptedText from '../components/ui/DecryptedText';

const MAX_MSG = 1000;

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
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/pages/contact`);
        if (res.ok) setPageData(await res.json());
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
    if (e.target.name === 'message' && value.length > MAX_MSG) return;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
        setTimeout(() => setStatus('idle'), 6000);
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  const socialLinks = [
    { icon: InstagramIcon, label: 'Instagram', href: config.instagram || config.social_instagram, color: 'hover:bg-pink-500 hover:border-pink-500' },
    { icon: LinkedinIcon, label: 'LinkedIn', href: config.linkedin || config.social_linkedin, color: 'hover:bg-blue-600 hover:border-blue-600' },
    { icon: MessageCircle, label: 'WhatsApp', href: config.whatsapp ? `https://wa.me/${config.whatsapp.replace(/\D/g,'')}` : null, color: 'hover:bg-green-500 hover:border-green-500' },
    { icon: Globe, label: 'Website', href: config.website, color: 'hover:bg-orange hover:border-orange' },
  ].filter(s => s.href);

  const workingHours = [
    { day: 'Monday – Friday', time: config.working_hours_weekday || '9:00 AM – 6:00 PM' },
    { day: 'Saturday', time: config.working_hours_saturday || '10:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  return (
    <div className="bg-grey-light dark:bg-[#060B13] min-h-screen font-sans transition-colors duration-500 pb-20">
      <Helmet>
        <title>{pageData?.seo_title || "Contact Us - EDIZO"}</title>
        <meta name="description" content={pageData?.seo_description || "Get in touch with EDIZO. Have a project in mind? Reach out to us today."} />
      </Helmet>

      {/* Modern Compact Header */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/10 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div {...fadeIn}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles size={14} className="text-[#B83200] dark:text-[#FF855C]" />
              <TypewriterText 
                texts={[
                  "Contact EDIZO",
                  "Design • Develop • Deliver",
                  "Talk with Engineering Leads",
                  "Response within 24 Hours"
                ]}
                typingSpeed={60}
                deletingSpeed={30}
                pauseDuration={2400}
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-navy dark:text-white mb-4 tracking-tight leading-[1.08]">
              Let's Build Something <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                Extraordinary.
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-navy/75 dark:text-white/75 max-w-2xl mx-auto leading-relaxed font-medium">
              {heroContent?.subtitle || "Have a project in mind, need tech consultation, or want to join our internship program? Reach out to our engineering team."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-6 max-w-7xl relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Info Side */}
          <motion.div {...fadeIn} className="lg:col-span-5 space-y-6">

            {/* Contact Info Card */}
            <div className="bg-white dark:bg-[#0B132B] p-7 md:p-8 rounded-3xl border border-navy/10 dark:border-white/10 shadow-sm backdrop-blur-xl">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-navy dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-[#D93800] dark:text-[#FF855C] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider mb-1">Email Us</h3>
                    <a href={`mailto:${config.email_1 || 'contact@edizo.in'}`} className="text-sm sm:text-base font-bold text-navy dark:text-white hover:text-orange transition-colors">
                      {config.email_1 || 'contact@edizo.in'}
                    </a>
                    {config.email_2 && (
                      <a href={`mailto:${config.email_2}`} className="block text-xs sm:text-sm text-navy/60 dark:text-white/60 hover:text-orange transition-colors mt-0.5">{config.email_2}</a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-[#D93800] dark:text-[#FF855C] shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider mb-1">Call Us</h3>
                    <a href={`tel:${config.phone || '+91 98765 43210'}`} className="text-sm sm:text-base font-bold text-navy dark:text-white hover:text-orange transition-colors">
                      {config.phone || '+91 98765 43210'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-[#D93800] dark:text-[#FF855C] shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider mb-1">{config.address_title || 'Headquarters'}</h3>
                    <p className="text-sm sm:text-base font-bold text-navy dark:text-white">
                      {config.address_line1 || 'Edizo Tech Solutions'}<br />
                      <span className="text-xs sm:text-sm font-normal text-navy/70 dark:text-white/70">{config.address_line2 || 'Bengaluru, Karnataka, India'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-navy/10 dark:border-white/10">
                  <h3 className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider mb-4">Follow Us</h3>
                  <div className="flex gap-3 flex-wrap">
                    {socialLinks.map(({ icon: Icon, label, href, color }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className={`w-10 h-10 rounded-xl border border-navy/10 dark:border-white/10 bg-navy/5 dark:bg-white/5 flex items-center justify-center text-navy dark:text-white ${color} hover:text-white transition-all`}
                      >
                        <Icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Working Hours Card */}
            <div className="bg-white dark:bg-[#0B132B] p-7 md:p-8 rounded-3xl border border-navy/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-[#D93800] dark:text-[#FF855C]">
                  <Clock size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-navy dark:text-white">Working Hours</h3>
              </div>
              <div className="space-y-2.5">
                {workingHours.map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-navy/5 dark:border-white/5 last:border-0">
                    <span className="text-xs sm:text-sm font-semibold text-navy/80 dark:text-white/80">{day}</span>
                    <span className={`text-xs sm:text-sm font-bold ${time === 'Closed' ? 'text-red-500' : 'text-navy dark:text-white'}`}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Embed */}
            {(config.map_embed_url || config.address_line2) && (
              <div className="rounded-3xl overflow-hidden border border-navy/10 dark:border-white/10 shadow-sm h-52">
                <iframe
                  title="EDIZO Location Map"
                  src={config.map_embed_url || `https://maps.google.com/maps?q=${encodeURIComponent((config.address_line1 || 'EDIZO') + ' ' + (config.address_line2 || 'Bengaluru'))}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </motion.div>

          {/* Form Side */}
          <motion.div {...fadeIn} className="lg:col-span-7">
            <div className="bg-white dark:bg-[#0B132B] p-8 md:p-10 rounded-3xl border border-navy/10 dark:border-white/10 shadow-sm relative overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy dark:text-white mb-6">Send Us a Message</h2>

              {status === 'success' && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-medium">
                  <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                  Your message has been sent! Our team will get back to you shortly.
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
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full bg-grey-light dark:bg-[#060B13] border border-navy/15 dark:border-white/10 px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy dark:text-white peer"
                      placeholder=" "
                    />
                    <label htmlFor="contact-name" className="absolute text-sm font-bold text-navy/60 dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                      Full Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="block w-full bg-grey-light dark:bg-[#060B13] border border-navy/15 dark:border-white/10 px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy dark:text-white peer"
                      placeholder=" "
                    />
                    <label htmlFor="contact-email" className="absolute text-sm font-bold text-navy/60 dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="tel"
                    id="contact-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full bg-grey-light dark:bg-[#060B13] border border-navy/15 dark:border-white/10 px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors text-navy dark:text-white peer"
                    placeholder=" "
                  />
                  <label htmlFor="contact-phone" className="absolute text-sm font-bold text-navy/60 dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                    Phone Number
                  </label>
                </div>

                <div className="relative group">
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full bg-grey-light dark:bg-[#060B13] border border-navy/15 dark:border-white/10 px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors appearance-none text-navy dark:text-white peer font-medium"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Website Development">Website Development</option>
                    <option value="App Development">App Development</option>
                    <option value="SEO">SEO &amp; Digital Marketing</option>
                    <option value="Internship">Internship &amp; Workshops</option>
                  </select>
                  <label htmlFor="contact-subject" className="absolute text-sm font-bold text-navy/60 dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5">
                    Service Interested In
                  </label>
                </div>

                {/* Message with char counter */}
                <div className="relative group">
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    required
                    className="block w-full bg-grey-light dark:bg-[#060B13] border border-navy/15 dark:border-white/10 px-5 pt-7 pb-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors resize-none text-navy dark:text-white peer"
                    placeholder=" "
                  />
                  <label htmlFor="contact-message" className="absolute text-sm font-bold text-navy/60 dark:text-white/60 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange">
                    Your Message
                  </label>
                  <div className={`absolute bottom-3 right-4 text-xs font-bold transition-colors ${formData.message.length > MAX_MSG * 0.9 ? 'text-orange' : 'text-navy/50 dark:text-white/50'}`}>
                    {formData.message.length}/{MAX_MSG}
                  </div>
                </div>

                {/* DPDP Privacy Consent */}
                <div className="flex items-center gap-3 text-xs text-navy/70 dark:text-white/70 pt-2">
                  <input
                    type="checkbox"
                    id="contact-consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="rounded border-navy/20 dark:border-white/20 text-orange focus:ring-orange w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="contact-consent" className="flex items-center gap-1 cursor-pointer">
                    <ShieldCheck size={14} className="text-orange shrink-0" />
                    I consent to EDIZO processing my data under the Digital Personal Data Protection (DPDP) Act 2023.
                  </label>
                </div>

                <button
                  type="submit"
                  id="contact-submit"
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
