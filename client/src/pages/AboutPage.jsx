import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Lightbulb, Target, Shield, Users, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const [pageData, setPageData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/pages/about`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch about page data", err);
      }
    };

    const fetchTeamData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_URL}/api/team`);
        if (res.ok) {
          const data = await res.json();
          setTeamMembers(data);
        }
      } catch (err) {
        console.error("Failed to fetch team data", err);
      }
    };
    
    Promise.all([fetchPageData(), fetchTeamData()]).finally(() => setLoading(false));
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const iconMap = {
    Lightbulb: <Lightbulb size={24} className="text-orange" />,
    Target: <Target size={24} className="text-orange" />,
    Shield: <Shield size={24} className="text-orange" />,
    Users: <Users size={24} className="text-orange" />
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-light">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange border-t-transparent"></div>
      </div>
    );
  }

  const values = pageData?.sections?.values 
    ? (typeof pageData.sections.values === 'string' ? JSON.parse(pageData.sections.values) : pageData.sections.values) 
    : [];

  const differentiators = pageData?.sections?.differentiators 
    ? (typeof pageData.sections.differentiators === 'string' ? JSON.parse(pageData.sections.differentiators) : pageData.sections.differentiators) 
    : [];
  
  const story = pageData?.sections?.story 
    ? (typeof pageData.sections.story === 'string' ? JSON.parse(pageData.sections.story) : pageData.sections.story) 
    : [];

  const storyMission = pageData?.sections?.storyMission 
    ? (typeof pageData.sections.storyMission === 'string' ? JSON.parse(pageData.sections.storyMission) : pageData.sections.storyMission) 
    : { mission: "", vision: "" };

  const cta = pageData?.sections?.cta 
    ? (typeof pageData.sections.cta === 'string' ? JSON.parse(pageData.sections.cta) : pageData.sections.cta) 
    : { title: "", subtitle: "", btnPrimary: "Get Started Now", btnSecondary: "Browse Positions" };

  const heroContent = pageData?.sections?.hero 
    ? (typeof pageData.sections.hero === 'string' ? JSON.parse(pageData.sections.hero) : pageData.sections.hero) 
    : { title: "", subtitle: "" };

  return (
    <div className="bg-grey-light font-sans transition-colors duration-500 pb-24">
      <Helmet>
        <title>{pageData?.seo_title || "About EDIZO - Our Mission & Vision"}</title>
        <meta name="description" content={pageData?.seo_description || "Discover the story behind EDIZO. We are empowering businesses with creative, technology-driven solutions."} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-navy pt-40 pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange/10 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
          <motion.div {...fadeIn}>
            <span className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-orange font-bold text-sm mb-8 tracking-wider uppercase backdrop-blur-sm">
              Empowering Next-Gen Talent
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-extrabold text-white leading-[1.05] tracking-tight mb-8">
              {heroContent.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              {heroContent.subtitle}
            </p>
            
            <div className="flex items-center justify-center gap-4 bg-white/5 border border-white/10 py-4 px-8 rounded-full w-fit mx-auto backdrop-blur-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} 
                    alt={`User ${i}`} 
                    className="w-10 h-10 rounded-full border-2 border-navy relative z-10"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center border-2 border-navy relative z-10 shadow-lg">
                  +5K
                </div>
              </div>
              <p className="text-sm font-bold text-white/80">Joined by 5,000+ elite mentors & interns</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      {story.length > 0 && (
        <section className="container mx-auto px-6 -mt-16 relative z-20 mb-32">
          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-grey-silver flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              {...fadeIn} 
              className="w-full lg:w-1/2"
            >
              <div className="rounded-[2rem] overflow-hidden relative group">
                <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img 
                  src="/images/EDIZO_Post_01.png" 
                  alt="Our Story" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'; }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-navy mb-8">Our Story</h2>
              
              <div className="space-y-6 text-lg text-grey-medium leading-relaxed mb-8">
                {story.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
              
              {(storyMission.mission || storyMission.vision) && (
                <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-grey-silver">
                  {storyMission.mission && (
                    <div className="bg-orange/5 rounded-2xl p-6 border border-orange/20 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-full bg-orange/20 text-orange flex items-center justify-center mb-4"><Target size={20} /></div>
                      <h3 className="font-display font-bold text-navy text-lg mb-2">Mission</h3>
                      <p className="text-grey-medium text-sm leading-relaxed">{storyMission.mission}</p>
                    </div>
                  )}
                  {storyMission.vision && (
                    <div className="bg-navy/5 rounded-2xl p-6 border border-navy/10 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center mb-4"><Lightbulb size={20} /></div>
                      <h3 className="font-display font-bold text-navy text-lg mb-2">Vision</h3>
                      <p className="text-grey-medium text-sm leading-relaxed">{storyMission.vision}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Core Values Bento Grid */}
      {values.length > 0 && (
        <section className="py-32 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-sm tracking-wider uppercase mb-4">Values</span>
              <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-extrabold text-navy mb-6">Our Core Values</motion.h2>
              <motion.p {...fadeIn} className="text-lg text-grey-medium">The principles that guide every pixel and line of code we write.</motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
              {values.map((val, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-grey-silver flex flex-col justify-between group
                    ${i === 0 ? 'lg:col-span-2 lg:row-span-1 bg-gradient-to-br from-navy to-[#0a1128] text-white border-none' : ''}
                    ${i === 3 ? 'lg:row-span-2 bg-gradient-to-br from-orange to-[#e04f1a] text-white border-none' : ''}
                  `}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                    ${(i === 0 || i === 3) ? 'bg-white/20 text-white' : 'bg-orange/10 text-orange'}
                  `}>
                    {iconMap[val.icon] || <Lightbulb size={24} />}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-display font-bold mb-3 ${(i === 0 || i === 3) ? 'text-white' : 'text-navy'}`}>{val.title}</h3>
                    <p className={`leading-relaxed text-sm ${(i === 0 || i === 3) ? 'text-white/80' : 'text-grey-medium'}`}>{val.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What Makes Us Different */}
      {differentiators.length > 0 && (
        <section className="py-24 bg-white border-y border-grey-silver">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/3">
                <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-extrabold text-navy mb-6 leading-tight">
                  What Makes Us <span className="text-orange">Different</span>
                </motion.h2>
                <p className="text-grey-medium text-lg leading-relaxed mb-8">
                  We don't just write code; we build scalable digital solutions that drive real business growth.
                </p>
                <Link to="/services" className="inline-flex items-center text-navy font-bold hover:text-orange transition-colors group">
                  Explore our services <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-6">
                {differentiators.map((diff, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4 p-6 bg-grey-light border border-grey-silver rounded-[2rem] hover:border-orange/30 hover:bg-white hover:shadow-lg transition-all group"
                  >
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 size={24} className="text-orange group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-navy font-medium leading-relaxed">{diff}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-32">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div {...fadeIn} className="text-center mb-20">
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-sm tracking-wider uppercase mb-4">
                Our Team
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-navy leading-tight mb-6">
                The minds behind <span className="text-orange">EDIZO</span>
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group cursor-pointer bg-white p-4 rounded-[2rem] border border-grey-silver hover:shadow-xl transition-all"
                >
                  <div className="overflow-hidden rounded-2xl mb-6 aspect-[4/5] bg-grey-light relative">
                    {member.image_url ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${member.image_url}`}
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange/20 to-orange/5 flex items-center justify-center text-6xl text-orange font-bold opacity-80 transition-transform duration-700 group-hover:scale-110">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="px-2 text-center">
                    <h3 className="text-xl font-display font-bold text-navy mb-1 group-hover:text-orange transition-colors">{member.name}</h3>
                    <p className="text-grey-medium font-bold text-xs uppercase tracking-wider mb-2">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cta.title && (
        <section className="container mx-auto px-6 mb-24">
          <motion.div 
            {...fadeIn}
            className="bg-navy rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange rounded-full mix-blend-screen filter blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
                {cta.title}
              </h2>
              <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto">
                {cta.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/register" className="px-8 py-4 bg-orange text-white rounded-full font-bold hover:bg-orange-dark transition-all text-sm tracking-wider uppercase inline-flex items-center justify-center shadow-lg shadow-orange/20 hover:-translate-y-1">
                  {cta.btnPrimary || 'Get Started'} <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/internships" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/20 inline-flex items-center justify-center hover:-translate-y-1">
                  {cta.btnSecondary || 'Browse Internships'}
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
