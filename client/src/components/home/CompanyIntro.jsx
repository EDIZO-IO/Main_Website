import { motion } from 'framer-motion';
import { Sparkles, Layers, Cpu, Smartphone, Cloud, CheckCircle2 } from 'lucide-react';
import ShinyText from '../ui/ShinyText';
import SpotlightCard from '../ui/SpotlightCard';
import DecryptedText from '../ui/DecryptedText';
import TypewriterText from '../ui/TypewriterText';

const PILLARS = [
  { icon: Layers, title: 'Full-Stack Web & SaaS', desc: 'React, Next.js, Node.js, and high-throughput REST/GraphQL APIs.' },
  { icon: Smartphone, title: 'Cross-Platform Mobile', desc: 'Native-feel Flutter and React Native apps for iOS and Android.' },
  { icon: Cloud, title: 'Cloud & DevOps Pipelines', desc: 'Automated CI/CD, AWS/Docker architecture, and 99.9% uptime.' },
  { icon: Cpu, title: 'AI & Data Integration', desc: 'Intelligent automation, smart dashboards, and modern data processing.' },
];

const CompanyIntro = () => {
  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#080E1B] transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="rounded-3xl bg-grey-light dark:bg-[#0B132B]/80 border border-navy/10 dark:border-white/10 p-8 md:p-14 relative overflow-hidden">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Visual & Tech Ecosystem Showcase */}
            <div className="lg:col-span-6 w-full">
              <SpotlightCard className="p-6 md:p-8 bg-white dark:bg-[#060B13] border border-navy/10 dark:border-white/10 shadow-lg">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-navy/10 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange animate-ping" />
                    <span className="font-mono text-xs font-bold text-navy dark:text-white uppercase tracking-wider">
                      <DecryptedText text="Architecture Stack" speed={25} trigger="hover" />
                    </span>
                  </div>
                  <span className="text-xs font-mono text-navy/60 dark:text-white/60">
                    <DecryptedText text="Verified Production" speed={30} trigger="view" />
                  </span>
                </div>

                {/* Visual Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6 bg-slate-900 aspect-video flex items-center justify-center border border-navy/5 dark:border-white/5 shadow-inner">
                  <img 
                    src="/images/digital_product_mockup.png" 
                    alt="EDIZO Digital Product Architecture" 
                    width="480"
                    height="270"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover rounded-2xl" 
                  />
                </div>

                {/* Structured Tech Tags Row */}
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Flutter', 'Next.js', 'PostgreSQL', 'AWS Cloud', 'Docker', 'Python'].map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-navy/5 dark:bg-white/5 text-navy/80 dark:text-white/80 border border-navy/5 dark:border-white/5"
                    >
                      <DecryptedText text={tech} speed={20} trigger="hover" />
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </div>

            {/* Right Content & 4-Pillar Grid */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-4 w-fit">
                <Sparkles size={13} />
                <TypewriterText 
                  texts={[
                    "Strategic Architecture & Engineering",
                    "Design • Develop • Deliver",
                    "Enterprise Production Readiness",
                    "Modern Cloud-Native Tech"
                  ]}
                  typingSpeed={60}
                  deletingSpeed={30}
                  pauseDuration={2400}
                />
              </div>

              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-display font-extrabold text-navy dark:text-white leading-[1.15] tracking-tight mb-4"
              >
                Scalable Software Built for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
                  High Performance & Growth.
                </span>
              </motion.h2>
              
              <p className="text-sm sm:text-base text-navy/75 dark:text-white/75 font-medium leading-relaxed mb-8">
                We design and build production-ready digital systems from architecture to cloud deployment, delivering robust software and mentoring the next generation of engineers through hands-on technical internships.
              </p>

              {/* 2x2 Structured Engineering Pillars */}
              <div className="grid sm:grid-cols-2 gap-4">
                {PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl bg-white dark:bg-[#060B13] border border-navy/5 dark:border-white/5 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-8 h-8 rounded-xl bg-orange/15 text-[#D93800] dark:text-[#FF855C] flex items-center justify-center mb-2.5">
                          <Icon size={16} />
                        </div>
                        <h3 className="text-sm font-bold text-navy dark:text-white mb-1">{pillar.title}</h3>
                        <p className="text-xs text-navy/60 dark:text-white/60 leading-relaxed">{pillar.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
