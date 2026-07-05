import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Code, Smartphone, Palette, Globe, Server, Database, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [servicesList, setServicesList] = useState([]);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        setServicesList(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/pages/home`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch home page data", err);
      }
    };

    fetchServices();
    fetchPageData();
  }, []);

  const icons = [<Globe />, <Smartphone />, <Palette />, <Server />, <Database />, <Code />];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const stats = pageData?.sections?.stats
    ? (typeof pageData.sections.stats === 'string' ? JSON.parse(pageData.sections.stats) : pageData.sections.stats)
    : [
    { label: "Projects Completed", value: "50+" },
    { label: "Happy Clients", value: "30+" },
    { label: "Interns Trained", value: "100+" },
    { label: "Combined Team Experience", value: "5+ Years" },
  ];

  const heroContent = pageData?.sections?.hero 
    ? (typeof pageData.sections.hero === 'string' ? JSON.parse(pageData.sections.hero) : pageData.sections.hero)
    : {
    title: "Building the Next Generation of Tech Leaders",
    subtitle: "Empowering students and businesses with cutting-edge IT services and intensive training programs.",
    ctaPrimary: "Explore Internships",
    ctaSecondary: "Our Services"
  };

  return (
    <div className="pt-24 pb-0 bg-white font-sans">
      <Helmet>
        <title>{pageData?.seo_title || "EDIZO - Tech Careers & Digital Agency"}</title>
        <meta name="description" content={pageData?.seo_description || "Accelerate your Tech Career with EDIZO. We offer high-quality design, development, marketing services, and industry-ready internship programs."} />
        <meta name="keywords" content={pageData?.seo_keywords || "web development, digital agency, tech internships, graphic design, edizo"} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 space-y-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-sm">
            Learn. Build. Launch.
          </span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-grey-dark leading-tight">
            {heroContent.title}
          </h1>
          <p className="text-xl text-grey-medium leading-relaxed max-w-lg">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/internships" className="px-8 py-4 bg-orange text-white rounded-full font-bold hover:bg-orange-dark transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-orange/20">
              {heroContent.ctaPrimary} <ArrowRight size={20} />
            </Link>
            <Link to="/services" className="px-8 py-4 bg-[#F8FAFC] text-grey-dark border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all text-center">
              {heroContent.ctaSecondary}
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-orange/20 to-transparent rounded-[3rem] blur-3xl -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
            alt="Team Collaboration" 
            className="rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
          />
          
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-grey-medium font-bold">Placement Rate</p>
              <p className="text-2xl font-bold text-grey-dark">92%</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-grey-dark py-16 text-white my-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-4xl md:text-5xl font-display font-bold text-orange mb-2">{stat.value}</h3>
                <p className="text-white/70 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl font-display font-bold text-grey-dark mb-4">Enterprise Services</motion.h2>
            <motion.p {...fadeIn} className="text-lg text-grey-medium">We deliver scalable software solutions for startups and Fortune 500s alike.</motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.length > 0 ? servicesList.map((svc, i) => (
              <motion.div 
                key={svc.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange/10 flex items-center justify-center text-orange mb-6 group-hover:scale-110 transition-transform">
                  {icons[i % icons.length]}
                </div>
                <h3 className="text-xl font-bold text-grey-dark mb-3">{svc.title}</h3>
                <p className="text-grey-medium leading-relaxed mb-6">{svc.description}</p>
                <Link to={`/services/${svc.id}`} className="text-orange font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </Link>
              </motion.div>
            )) : <p className="text-center w-full">Loading services...</p>}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl font-display font-bold text-grey-dark mb-4">What Our Clients & Interns Say</motion.h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pageData?.sections?.testimonials ? (
              (typeof pageData.sections.testimonials === 'string' ? JSON.parse(pageData.sections.testimonials) : pageData.sections.testimonials).map((t, idx) => (
                <motion.div key={idx} {...fadeIn} className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 relative">
                  <p className="text-lg text-grey-dark italic mb-6">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-grey-dark">{t.name}</p>
                    <p className="text-sm text-grey-medium">{t.role}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <>
                <motion.div {...fadeIn} className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 relative">
                  <p className="text-lg text-grey-dark italic mb-6">"EDIZO redesigned our website and handled our social media — our engagement doubled in two months."</p>
                  <div>
                    <p className="font-bold text-grey-dark">Client Name</p>
                    <p className="text-sm text-grey-medium">Business Name</p>
                  </div>
                </motion.div>
                <motion.div {...fadeIn} className="bg-[#F8FAFC] p-8 rounded-[2rem] border border-gray-100 relative">
                  <p className="text-lg text-grey-dark italic mb-6">"The internship program gave me real hands-on project experience I couldn't get anywhere else."</p>
                  <div>
                    <p className="font-bold text-grey-dark">Intern Name</p>
                    <p className="text-sm text-grey-medium">College Name</p>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            {...fadeIn}
            className="bg-gradient-to-br from-orange to-orange-dark rounded-[3rem] p-12 md:p-20 text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {pageData?.sections?.cta ? (typeof pageData.sections.cta === 'string' ? JSON.parse(pageData.sections.cta).title : pageData.sections.cta.title) : "Ready to build something amazing?"}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {pageData?.sections?.cta ? (typeof pageData.sections.cta === 'string' ? JSON.parse(pageData.sections.cta).subtitle : pageData.sections.cta.subtitle) : "Let's bring your vision to life."}
            </p>
            <Link to="/contact" className="inline-block px-10 py-4 bg-white text-orange rounded-full font-bold hover:bg-gray-100 transition-all text-lg shadow-lg">
              {pageData?.sections?.cta ? (typeof pageData.sections.cta === 'string' ? JSON.parse(pageData.sections.cta).btnText : pageData.sections.cta.btnText) : "Contact Us Today"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
