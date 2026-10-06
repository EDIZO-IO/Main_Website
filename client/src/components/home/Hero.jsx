import { motion } from 'framer-motion';
import { ArrowRight, Code2, GraduationCap, Sparkles, Terminal, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import ShinyText from '../ui/ShinyText';
import TiltedCard from '../ui/TiltedCard';
import Magnet from '../ui/Magnet';
import DecryptedText from '../ui/DecryptedText';
import TypewriterText from '../ui/TypewriterText';

const Hero = () => {
  const { settings: config } = useSite();
  const projectsCount = config?.stat_projects ? `${config.stat_projects}+` : '50+';

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center bg-grey-light dark:bg-[#060B13] transition-colors duration-500">
      {/* Ambient Gradient Glow Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-orange/10 dark:bg-orange/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-blue-600/10 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Structured Typography & Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Top Category Badge / Brand Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-6 w-fit shadow-xs">
              <Sparkles size={14} className="text-[#B83200] dark:text-[#FF855C]" />
              <ShinyText text="DESIGN • DEVELOP • DELIVER" />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-extrabold text-navy dark:text-white leading-[1.08] tracking-tight mb-6">
              Turning Ideas Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                Digital Experiences.
              </span>
            </h1>
            
            {/* Clear Value Proposition */}
            <p className="text-base sm:text-lg md:text-xl text-navy/80 dark:text-white/80 font-medium leading-relaxed mb-8 max-w-2xl">
              EDIZO is a creative digital agency helping businesses, creators, and aspiring professionals build, grow, and succeed through design, technology, and digital solutions.
            </p>
            
            {/* Structured Dual Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Magnet padding={20} magnetStrength={3}>
                <Link 
                  to="/contact" 
                  className="px-7 py-3.5 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2.5 shadow-sm"
                >
                  <Code2 size={18} />
                  <span>Start A Project</span>
                  <ArrowRight size={15} />
                </Link>
              </Magnet>

              <Magnet padding={20} magnetStrength={3}>
                <Link 
                  to="/internships" 
                  className="px-7 py-3.5 bg-white dark:bg-[#0B132B] text-navy dark:text-white border-2 border-navy/15 dark:border-white/15 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider hover:border-[#D93800] dark:hover:border-[#FF5A1F] hover:text-[#D93800] dark:hover:text-[#FF855C] transition-all duration-200 flex items-center gap-2.5 shadow-xs"
                >
                  <GraduationCap size={18} className="text-orange" />
                  <span>Explore Internships</span>
                  <ArrowRight size={15} />
                </Link>
              </Magnet>
            </div>

            {/* Structured 3-Column Highlights Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-navy/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy dark:text-white">Custom Software</div>
                  <div className="text-[11px] text-navy/60 dark:text-white/60">Web & Mobile SaaS</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy dark:text-white">Live Industry Projects</div>
                  <div className="text-[11px] text-navy/60 dark:text-white/60">Hands-on Experience</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-navy dark:text-white">Mentorship & Certs</div>
                  <div className="text-[11px] text-navy/60 dark:text-white/60">Verified Career Growth</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Structured 3D Tech Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center w-full"
          >
            <TiltedCard maxTilt={6} className="w-full max-w-[500px]">
              <div className="rounded-3xl bg-white dark:bg-[#0B132B] p-6 border border-navy/10 dark:border-white/10 shadow-xl backdrop-blur-xl">
                
                {/* Visual Window Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-navy/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-xs text-navy/60 dark:text-white/60">
                      <DecryptedText text="edizo-core-hub" speed={25} trigger="hover" />
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-mono text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <DecryptedText text="ACTIVE PLATFORM" speed={30} trigger="view" />
                  </span>
                </div>

                {/* Center Image */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center mb-5 shadow-inner">
                  <img 
                    src="/images/EDIZO_Post_01.png" 
                    alt="EDIZO - Turning Ideas Into Digital Experiences" 
                    width="480" 
                    height="270" 
                    fetchpriority="high" 
                    decoding="async" 
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      <Terminal size={12} className="text-orange" />
                      <TypewriterText 
                        texts={[
                          "Stack: React • Node • Flutter • Cloud",
                          "Delivery: UI/UX • SaaS • Mobile Apps",
                          "Academy: Real Industry Mentorship"
                        ]} 
                        typingSpeed={60} 
                        deletingSpeed={30} 
                        pauseDuration={2500} 
                      />
                    </span>
                  </div>
                </div>

                {/* Structured In-Card Stats Matrix */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 size={15} className="text-[#D93800] dark:text-[#FF855C]" />
                      <span className="text-[11px] font-bold text-navy/70 dark:text-white/70 uppercase">Software Delivery</span>
                    </div>
                    <div className="text-xl font-extrabold text-navy dark:text-white font-display">{projectsCount} Deployed</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">Enterprise Quality</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-navy/5 dark:bg-white/5 border border-navy/5 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap size={15} className="text-blue-500 dark:text-cyan-400" />
                      <span className="text-[11px] font-bold text-navy/70 dark:text-white/70 uppercase">Intern Academy</span>
                    </div>
                    <div className="text-xl font-extrabold text-navy dark:text-white font-display">100% Practical</div>
                    <div className="text-[11px] text-navy/60 dark:text-white/60">Live Mentorship</div>
                  </div>
                </div>

              </div>
            </TiltedCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
