import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, CheckCircle2, Play, Globe,
  Users, Target, Lightbulb, ShieldCheck, Layers, Star,
  ChevronRight, Sparkles
} from 'lucide-react';
import { LinkedinIcon, TwitterIcon } from '../components/SocialIcons';
import TypewriterText from '../components/ui/TypewriterText';
import CountUp from '../components/ui/CountUp';
import DecryptedText from '../components/ui/DecryptedText';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const fetchAll = async () => {
      try {
        const [pageRes, teamRes, partnerRes] = await Promise.all([
          fetch(`${API_URL}/api/pages/about`).catch(() => null),
          fetch(`${API_URL}/api/team`).catch(() => null),
          fetch(`${API_URL}/api/partners`).catch(() => null),
        ]);
        if (pageRes?.ok) setPageData(await pageRes.json());
        if (teamRes?.ok) setTeamMembers(await teamRes.json());
        if (partnerRes?.ok) setPartners(await partnerRes.json());
      } catch (err) {
        console.error("Failed to fetch about page data", err);
      }
    };
    fetchAll();
  }, []);

  const safeParse = (val, fallback) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return fallback; }
  };

  const heroContent = safeParse(pageData?.sections?.hero, {
    title: "Building Digital Solutions with Real-World Impact.",
    subtitle: "We are a team of builders, thinkers, and problem solvers creating digital solutions that make a real impact.",
    stats: [
      { value: "50+", label: "Projects Delivered" },
      { value: "30+", label: "Happy Clients" },
      { value: "100+", label: "Talented Interns" },
    ]
  });

  const story = safeParse(pageData?.sections?.story, [
    "EDIZO was founded with a simple belief — technology should solve real problems and create real opportunities. What started as a small team with big dreams has now grown into a full-fledged software development company, delivering innovative solutions for businesses and empowering the next generation of tech talent through our internship programs."
  ]);

  const storyMission = safeParse(pageData?.sections?.storyMission, {
    mission: "To deliver high-quality, scalable, and innovative digital solutions that help businesses grow and create meaningful opportunities for people.",
    vision: "To be a trusted global technology partner, known for innovation, integrity, and impact — and to create a future where talent and technology grow together."
  });

  const values = safeParse(pageData?.sections?.values, [
    { icon: "Users", title: "People First", desc: "We value our team, clients, and community." },
    { icon: "Lightbulb", title: "Innovation", desc: "We embrace new ideas and technologies." },
    { icon: "ShieldCheck", title: "Integrity", desc: "We do what's right, always." },
    { icon: "Star", title: "Excellence", desc: "We strive for the highest quality." },
    { icon: "Layers", title: "Collaboration", desc: "We grow together." },
  ]);

  const differentiators = safeParse(pageData?.sections?.differentiators, [
    "Client-focused approach",
    "Modern technology stack",
    "Transparent communication",
    "On-time delivery",
    "Long-term support",
  ]);

  const timeline = safeParse(pageData?.sections?.timeline, [
    { year: "2022", event: "EDIZO was founded" },
    { year: "2023", event: "Completed first 10+ client projects" },
    { year: "2024", event: "Launched Internship program" },
    { year: "2025", event: "Expanded team & services" },
    { year: "2026", event: "50+ projects and growing" },
  ]);

  const cta = safeParse(pageData?.sections?.cta, {
    title: "Let's Build Something Great Together",
    subtitle: "Have a project in mind or want to explore opportunities? We'd love to hear from you.",
    btnPrimary: "Start a Project",
    btnSecondary: "Join Our Team",
  });

  const iconMap = {
    Users: <Users size={22} className="text-orange" />,
    Lightbulb: <Lightbulb size={22} className="text-orange" />,
    ShieldCheck: <ShieldCheck size={22} className="text-orange" />,
    Star: <Star size={22} className="text-orange" />,
    Layers: <Layers size={22} className="text-orange" />,
    Target: <Target size={22} className="text-orange" />,
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const heroStats = heroContent.stats || [
    { value: "50+", label: "Projects Delivered" },
    { value: "30+", label: "Happy Clients" },
    { value: "100+", label: "Talented Interns" },
  ];

  return (
    <div className="bg-white dark:bg-[#060B13] font-sans overflow-x-hidden transition-colors duration-500">
      <Helmet>
        <title>{pageData?.seo_title || "About EDIZO - More Than a Software Company"}</title>
        <meta name="description" content={pageData?.seo_description || "EDIZO is a team of builders, thinkers, and problem solvers creating digital solutions that make a real impact."} />
      </Helmet>

      {/* ============================================================
          HERO SECTION — Modern & Unified
      ============================================================ */}
      <section className="relative bg-grey-light dark:bg-[#060B13] pt-32 pb-16 overflow-hidden border-b border-navy/5 dark:border-white/5 transition-colors duration-500">
        {/* Ambient Gradient Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-orange/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-600/10 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-5 w-fit shadow-xs"
              >
                <Sparkles size={14} className="text-[#B83200] dark:text-[#FF855C]" />
                <TypewriterText 
                  texts={[
                    "About EDIZO",
                    "Design • Develop • Deliver",
                    "Software Engineering & Academy",
                    "Impact-Driven Innovation"
                  ]}
                  typingSpeed={60}
                  deletingSpeed={30}
                  pauseDuration={2400}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-extrabold leading-[1.08] tracking-tight mb-5 text-navy dark:text-white"
              >
                Building Digital Solutions with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                  Real-World Impact.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-base sm:text-lg text-navy/80 dark:text-white/80 max-w-xl leading-relaxed mb-8 font-medium"
              >
                {heroContent.subtitle || "We are a team of builders, thinkers, and problem solvers creating digital solutions that make a real impact."}
              </motion.p>

              {/* Stats matrix */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-8 sm:gap-12 flex-wrap mb-8 pb-6 border-b border-navy/10 dark:border-white/10"
              >
                {heroStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white">
                      <CountUp to={stat.value} duration={1.5} suffix={stat.value.includes('+') ? '+' : ''} />
                    </p>
                    <p className="text-xs font-bold text-navy/60 dark:text-white/60 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex gap-4 flex-wrap items-center"
              >
                <Link
                  to="/contact"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider shadow-sm"
                >
                  <span>Start A Project</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link
                  to="/internships"
                  className="px-7 py-3.5 bg-white dark:bg-[#0B132B] text-navy dark:text-white border-2 border-navy/15 dark:border-white/15 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:border-[#D93800] dark:hover:border-[#FF5A1F] hover:text-[#D93800] dark:hover:text-[#FF855C] transition-all inline-flex items-center gap-2 shadow-xs"
                >
                  <span>Join Academy</span>
                </Link>
              </motion.div>
            </div>

            {/* Right Card Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-5 flex justify-center w-full"
            >
              <div className="w-full max-w-[480px] rounded-3xl bg-white dark:bg-[#0B132B] p-5 md:p-6 border border-navy/10 dark:border-white/10 shadow-xl backdrop-blur-xl relative">
                
                {/* Header info */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-navy/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange animate-pulse" />
                    <span className="font-mono text-xs font-bold text-navy dark:text-white uppercase tracking-wider">
                      <DecryptedText text="EDIZO HEADQUARTERS" speed={30} trigger="view" />
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-mono text-[10px] font-bold">
                    ACTIVE AGENCY
                  </span>
                </div>

                {/* Photo */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] flex items-center justify-center mb-4 shadow-inner">
                  <img
                    src="/images/about-hero.jpg"
                    alt="EDIZO Engineering Team & Workspace"
                    width="440"
                    height="330"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating chip on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg">
                      <Globe size={13} className="text-orange" /> Global Digital Delivery
                    </span>
                  </div>
                </div>

                {/* Bottom Values Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="text-xs font-bold text-navy dark:text-white mb-0.5">Engineering Focus</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">Quality &amp; Precision</div>
                  </div>
                  <div className="p-3 rounded-xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="text-xs font-bold text-navy dark:text-white mb-0.5">Talent Incubation</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">Career Acceleration</div>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          OUR STORY SECTION
      ============================================================ */}
      <section className="py-20 bg-white dark:bg-[#080E1B] transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: Text */}
            <motion.div {...fadeUp}>
              <span className="text-[#D93800] dark:text-[#FF855C] font-bold text-xs uppercase tracking-widest mb-4 block">Our Story</span>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-tight mb-8">
                From Ideas to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                  Real-World Impact
                </span>
              </h2>
              <div className="space-y-5 text-navy/75 dark:text-white/75 leading-relaxed text-base sm:text-lg mb-10 font-medium">
                {(Array.isArray(story) ? story : [story]).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div className="flex items-center gap-5 flex-wrap">
                <Link
                  to="/contact"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange/30 transition-all flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>Read our story</span>
                  <ArrowRight size={15} />
                </Link>
                <Link 
                  to="/projects"
                  className="flex items-center gap-3 text-navy dark:text-white font-bold hover:text-orange dark:hover:text-orange transition-colors group text-sm"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-navy/20 dark:border-white/20 group-hover:border-orange flex items-center justify-center transition-colors">
                    <Play size={14} fill="currentColor" />
                  </div>
                  <span>View Our Work</span>
                </Link>
              </div>
            </motion.div>

            {/* Right: Image collage */}
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden h-[420px] shadow-xl border border-navy/10 dark:border-white/10">
                <img
                  src="/images/team-story.jpg"
                  alt="EDIZO Team"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'; }}
                />
              </div>

              {/* Floating card — top right */}
              <div className="absolute -top-5 -right-5 bg-white dark:bg-[#0B132B] rounded-2xl shadow-xl p-4 border border-navy/10 dark:border-white/10 flex items-center gap-3 z-10 max-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-orange/10 dark:bg-orange/20 flex items-center justify-center text-[#D93800] dark:text-[#FF855C] shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-navy dark:text-white leading-tight">Team That Builds</p>
                  <p className="text-[11px] text-navy/60 dark:text-white/60">Developers &amp; Designers</p>
                </div>
              </div>

              {/* Floating card — bottom left */}
              <div className="absolute -bottom-5 left-6 bg-[#0B132B] dark:bg-[#060B13] border border-white/10 rounded-2xl shadow-xl p-4 flex items-center gap-3 z-10 max-w-[230px]">
                <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center text-white shrink-0">
                  <Star size={16} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">Engineering Growth</p>
                  <p className="text-[11px] text-white/60">Real Industrial Impact</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MISSION + VISION + QUOTE
      ============================================================ */}
      <section className="py-20 bg-grey-light dark:bg-[#060B13] border-y border-navy/10 dark:border-white/10 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Mission */}
            <motion.div {...fadeUp} className="bg-white dark:bg-[#0B132B] p-8 rounded-3xl border border-navy/10 dark:border-white/10 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-orange/10 dark:bg-orange/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-[#D93800] dark:text-[#FF855C]">
                <Target size={22} />
              </div>
              <span className="text-xs font-extrabold text-[#D93800] dark:text-[#FF855C] uppercase tracking-widest mb-3 block">Our Mission</span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-navy dark:text-white mb-4 leading-tight">Build Technology That Matters</h3>
              <p className="text-navy/70 dark:text-white/70 leading-relaxed text-sm">{storyMission.mission}</p>
            </motion.div>

            {/* Vision */}
            <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }} className="bg-white dark:bg-[#0B132B] p-8 rounded-3xl border border-navy/10 dark:border-white/10 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 dark:bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-blue-600 dark:text-cyan-400">
                <Lightbulb size={22} />
              </div>
              <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-3 block">Our Vision</span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-navy dark:text-white mb-4 leading-tight">A Smarter, Connected Tomorrow</h3>
              <p className="text-navy/70 dark:text-white/70 leading-relaxed text-sm">{storyMission.vision}</p>
            </motion.div>

            {/* Quote */}
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }} className="bg-navy dark:bg-[#080E1B] border border-navy/10 dark:border-white/10 p-8 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-all">
              <div className="text-5xl text-orange font-serif leading-none mb-4">"</div>
              <p className="text-lg sm:text-xl font-display font-bold text-white leading-snug italic mb-6">
                Build. Automate. Scale.<br />
                That's not just what we do.<br />
                It's who we are.
              </p>
              <p className="text-orange font-bold text-sm tracking-wider">— EDIZO</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          CORE VALUES — "What Drives Us"
      ============================================================ */}
      <section className="py-20 bg-white dark:bg-[#080E1B] transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-10">
            <span className="text-[#D93800] dark:text-[#FF855C] font-bold text-xs uppercase tracking-widest block mb-2">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-navy dark:text-white">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-grey-light dark:bg-[#0B132B] rounded-3xl p-6 text-center hover:shadow-lg border border-navy/10 dark:border-white/10 hover:border-orange/30 transition-all group"
              >
                <div className="w-12 h-12 bg-white dark:bg-[#060B13] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-navy/5 dark:border-white/10 group-hover:scale-110 transition-all">
                  {iconMap[val.icon] || <Star size={22} className="text-orange" />}
                </div>
                <h3 className="font-display font-bold text-navy dark:text-white text-sm mb-1.5">{val.title}</h3>
                <p className="text-navy/65 dark:text-white/65 text-xs leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHY CHOOSE + TIMELINE
      ============================================================ */}
      <section className="py-20 bg-grey-light dark:bg-[#060B13] border-y border-navy/10 dark:border-white/10 transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* Left: Why Choose EDIZO */}
            <motion.div {...fadeUp}>
              <span className="text-[#D93800] dark:text-[#FF855C] font-bold text-xs uppercase tracking-widest block mb-3">Why Choose EDIZO</span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-navy dark:text-white mb-5 leading-tight">
                Engineering Real Results
              </h2>
              <p className="text-navy/70 dark:text-white/70 leading-relaxed mb-6 font-medium">
                We combine strategy, design, and technology to deliver solutions that are not just functional, but future-ready.
              </p>
              <ul className="space-y-3 mb-8">
                {differentiators.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-navy dark:text-white font-medium text-sm">
                    <CheckCircle2 size={18} className="text-[#D93800] dark:text-[#FF855C] shrink-0" />
                    {typeof item === 'string' ? item : item.title}
                  </li>
                ))}
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy/20 dark:border-white/20 text-navy dark:text-white rounded-full font-bold hover:border-orange hover:text-orange transition-all text-xs uppercase tracking-wider"
              >
                <span>Explore Our Services</span>
                <ArrowRight size={15} />
              </Link>
            </motion.div>

            {/* Center: Timeline */}
            <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.6 }}>
              <h3 className="text-xl font-display font-bold text-navy dark:text-white mb-2">Our Journey</h3>
              <p className="text-navy/60 dark:text-white/60 text-sm mb-8">Key milestones in our growth story.</p>
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-navy/10 dark:bg-white/10" />
                <div className="space-y-7">
                  {timeline.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex gap-4 group"
                    >
                      {/* Dot */}
                      <div className="absolute -left-[17px] top-1 w-4 h-4 rounded-full border-2 border-orange bg-white dark:bg-[#060B13] group-hover:bg-orange transition-colors shrink-0" />
                      <div>
                        <span className="text-[#D93800] dark:text-[#FF855C] font-extrabold text-sm block mb-0.5">{item.year}</span>
                        <p className="text-navy dark:text-white font-medium text-sm leading-snug">{item.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Photo with overlay text */}
            <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.6 }} className="relative rounded-3xl overflow-hidden h-[420px] lg:h-auto shadow-xl border border-navy/10 dark:border-white/10">
              <img
                src="/images/team-photo.jpg"
                alt="EDIZO Team at Work"
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-3xl font-display font-extrabold text-white leading-tight">
                  Great<br />People<br />Build<br />Great<br />Things
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================
          TEAM SECTION
      ============================================================ */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#080E1B] transition-colors duration-500">
          <div className="container mx-auto px-6 max-w-7xl">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-4xl font-display font-extrabold text-navy dark:text-white mb-4">Meet Our Team</h2>
              <p className="text-navy/70 dark:text-white/70 text-base sm:text-lg max-w-xl mx-auto font-medium">The minds and hearts behind everything we build.</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-white dark:bg-[#0B132B] rounded-3xl border border-navy/10 dark:border-white/10 hover:shadow-xl transition-all p-4"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-navy/5 dark:bg-white/5 mb-4">
                    {member.image_url ? (
                      <img
                        src={`${API_URL}${member.image_url}`}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-orange/40">
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-navy dark:text-white group-hover:text-orange transition-colors">{member.name}</h3>
                  <p className="text-xs font-bold text-navy/60 dark:text-white/60 uppercase tracking-wider mb-3">{member.role}</p>
                  <div className="flex gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-navy/5 dark:bg-white/10 hover:bg-blue-600 text-navy dark:text-white hover:text-white flex items-center justify-center transition-all">
                        <LinkedinIcon size={13} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-navy/5 dark:bg-white/10 hover:bg-sky-500 text-navy dark:text-white hover:text-white flex items-center justify-center transition-all">
                        <TwitterIcon size={13} />
                      </a>
                    )}
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-full bg-navy/5 dark:bg-white/10 hover:bg-orange text-navy dark:text-white hover:text-white flex items-center justify-center transition-all">
                        <Globe size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          TRUSTED CLIENTS LOGO STRIP
      ============================================================ */}
      {partners.length > 0 && (
        <section className="py-14 bg-grey-light dark:bg-[#060B13] border-y border-navy/10 dark:border-white/10 transition-colors duration-500">
          <div className="container mx-auto px-6 max-w-7xl">
            <p className="text-xs font-extrabold text-navy/60 dark:text-white/60 uppercase tracking-widest text-center mb-8">
              Trusted by Innovative Businesses
            </p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {partners.map((partner, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#0B132B] rounded-full border border-navy/10 dark:border-white/10 shadow-xs hover:border-orange/30 hover:shadow-md transition-all cursor-default"
                >
                  {partner.logo_url ? (
                    <img src={`${API_URL}${partner.logo_url}`} alt={partner.name} className="h-5 object-contain" />
                  ) : (
                    <span className="text-navy dark:text-white font-bold text-sm">{partner.name}</span>
                  )}
                </div>
              ))}
              <Link
                to="/projects"
                className="flex items-center gap-2 px-5 py-2.5 border border-navy/20 dark:border-white/20 text-navy dark:text-white rounded-full font-bold text-sm hover:bg-navy hover:text-white transition-all"
              >
                <span>View Our Work</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          CTA FOOTER BAR
      ============================================================ */}
      <section className="py-16 bg-navy dark:bg-[#050B14] transition-colors duration-500">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3">
                {cta.title}
              </h2>
              <p className="text-white/70 max-w-xl font-medium">{cta.subtitle}</p>
            </div>
            <div className="flex gap-4 flex-wrap justify-center shrink-0">
              <Link
                to="/contact"
                className="px-7 py-3.5 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white font-bold rounded-full hover:shadow-lg hover:shadow-orange/30 transition-all inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
              >
                <span>{cta.btnPrimary}</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/internships"
                className="px-7 py-3.5 bg-white/10 border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
              >
                <span>{cta.btnSecondary}</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
