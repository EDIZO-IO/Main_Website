import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Lightbulb, Target, Shield, Users } from 'lucide-react';

const AboutPage = () => {
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/pages/about`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (err) {
        console.error("Failed to fetch about page data", err);
      }
    };
    fetchPageData();
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

  const values = pageData?.sections?.values 
    ? (typeof pageData.sections.values === 'string' ? JSON.parse(pageData.sections.values) : pageData.sections.values) 
    : [
    { icon: "Lightbulb", title: "Creativity", desc: "We think differently to deliver unique solutions." },
    { icon: "Target", title: "Quality", desc: "We don't compromise on the standard of our work." },
    { icon: "Shield", title: "Integrity", desc: "Transparent communication and honest pricing." },
    { icon: "Users", title: "Growth", desc: "We grow with our clients and our interns." },
    { icon: "Users", title: "Collaboration", desc: "Every project is a partnership." }
  ];

  const differentiators = pageData?.sections?.differentiators 
    ? (typeof pageData.sections.differentiators === 'string' ? JSON.parse(pageData.sections.differentiators) : pageData.sections.differentiators) 
    : [
    "All services under one roof — no need for multiple vendors",
    "Combination of creative design + technical development + marketing",
    "Personal attention to every project, regardless of size",
    "Strong focus on mentoring interns into industry-ready professionals"
  ];
  
  const story = pageData?.sections?.story 
    ? (typeof pageData.sections.story === 'string' ? JSON.parse(pageData.sections.story) : pageData.sections.story) 
    : [
    "EDIZO was founded with a simple goal — to make high-quality design, development, and marketing services accessible to businesses and individuals of all sizes.",
    "What started as a small creative team has grown into a multi-service digital agency that partners with startups, small businesses, and enterprises to build meaningful digital experiences.",
    "Alongside client projects, EDIZO is passionate about nurturing new talent through structured internship programs that give students real-world, industry-ready experience."
  ];

  const storyMission = pageData?.sections?.storyMission 
    ? (typeof pageData.sections.storyMission === 'string' ? JSON.parse(pageData.sections.storyMission) : pageData.sections.storyMission) 
    : {
      mission: "To empower businesses with creative, technology-driven solutions that are affordable, scalable, and results-focused — while building a skilled talent pipeline through hands-on internships.",
      vision: "To become a trusted global digital partner known for creativity, innovation, and integrity, while creating opportunities for the next generation of designers, developers, and marketers."
    };

  const cta = pageData?.sections?.cta 
    ? (typeof pageData.sections.cta === 'string' ? JSON.parse(pageData.sections.cta) : pageData.sections.cta) 
    : {
      title: "Ready to start your journey?",
      subtitle: "Join the thousands of developers already leveling up their careers with Edizo.",
      btnPrimary: "Get Started Now",
      btnSecondary: "Browse Positions"
    };

  const team = pageData?.sections?.team 
    ? (typeof pageData.sections.team === 'string' ? JSON.parse(pageData.sections.team) : pageData.sections.team) 
    : [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Marcus Thorne",
      role: "CTO",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Design",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "David Okator",
      role: "Chief of Community",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const heroContent = pageData?.sections?.hero 
    ? (typeof pageData.sections.hero === 'string' ? JSON.parse(pageData.sections.hero) : pageData.sections.hero) 
    : {
    title: "Empowering the Next Generation of Tech Leaders",
    subtitle: "EDIZO was founded with a singular vision: to bridge the massive gap between academic learning and industry expectations. We are a collective of senior engineers, product designers, and growth experts dedicated to building robust digital solutions and training the developers of tomorrow."
  };

  return (
    <div className="pt-32 pb-0 bg-white font-sans">
      <Helmet>
        <title>{pageData?.seo_title || "About EDIZO - Our Mission & Vision"}</title>
        <meta name="description" content={pageData?.seo_description || "Discover the story behind EDIZO. We are empowering businesses with creative, technology-driven solutions that are affordable and scalable."} />
      </Helmet>
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center mb-32 max-w-4xl">
        <motion.div {...fadeIn}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange font-bold text-sm mb-6">
            Empowering Next-Gen Talent
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-grey-dark leading-tight mb-8">
            {heroContent.title}
          </h1>
          <p className="text-xl text-grey-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            {heroContent.subtitle}
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} 
                  alt={`User ${i}`} 
                  className="w-10 h-10 rounded-full border-2 border-white relative z-10"
                />
              ))}
              <div className="w-10 h-10 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center border-2 border-white relative z-10">
                +5K
              </div>
            </div>
            <p className="text-sm font-medium text-grey-dark">Joined by 5,000+ elite mentors & interns</p>
          </div>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            {...fadeIn} 
            className="w-full lg:w-1/2"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
                alt="City Skyline" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div 
            {...fadeIn} 
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full lg:w-1/2 max-w-xl"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-grey-dark mb-8">Our Story</h2>
            
            <div className="space-y-6 text-lg text-grey-medium leading-relaxed mb-8">
              {story.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            
            <div className="p-6 border-l-4 border-orange bg-orange/5 rounded-r-2xl space-y-4">
              <div>
                <h3 className="font-bold text-grey-dark text-xl mb-1">Our Mission</h3>
                <p className="text-grey-medium text-sm">{storyMission.mission}</p>
              </div>
              <div>
                <h3 className="font-bold text-grey-dark text-xl mb-1">Our Vision</h3>
                <p className="text-grey-medium text-sm">{storyMission.vision}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-[#F8FAFC] py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-bold text-grey-dark mb-4">Our Core Values</motion.h2>
            <motion.p {...fadeIn} className="text-lg text-grey-medium">The principles that guide every pixel and line of code we write.</motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center mb-6">
                  {iconMap[val.icon] || <Lightbulb size={24} className="text-orange" />}
                </div>
                <h3 className="text-xl font-bold text-grey-dark mb-3">{val.title}</h3>
                <p className="text-grey-medium leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-bold text-grey-dark mb-4">What Makes Us Different</motion.h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {differentiators.map((diff, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-6 bg-grey-light rounded-2xl"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                  ✓
                </div>
                <p className="text-grey-dark font-medium leading-relaxed">{diff}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-32 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 {...fadeIn} className="text-4xl md:text-5xl font-display font-bold text-grey-dark mb-6">Our Team</motion.h2>
          <motion.p {...fadeIn} className="text-lg text-grey-medium max-w-3xl mx-auto mb-16">
            EDIZO is powered by a passionate team of graphic designers, video editors, web & app developers, SEO specialists, and digital marketers who collaborate closely to deliver end-to-end digital solutions.
          </motion.p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden rounded-[2rem] mb-6 aspect-square bg-gray-100">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold text-grey-dark mb-1">{member.name}</h3>
                <p className="text-orange font-medium text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 mb-32">
        <motion.div 
          {...fadeIn}
          className="bg-gradient-to-br from-[#803800] to-[#5a2700] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/20 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl -z-0"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              {cta.title}
            </h2>
            <p className="text-white/80 text-lg mb-10">
              {cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-orange text-white rounded-full font-bold hover:bg-orange-dark transition-all text-lg inline-flex items-center justify-center gap-2">
                {cta.btnPrimary} <ArrowRight size={20} />
              </Link>
              <Link to="/internships" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all text-lg border border-white/20 inline-flex items-center justify-center">
                {cta.btnSecondary}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
