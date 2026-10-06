import { motion } from 'framer-motion';
import { Database, Cloud, Terminal, Layers, Server, Smartphone, Cpu, ShieldCheck, Sparkles, Code2 } from 'lucide-react';
import ShinyText from '../ui/ShinyText';
import SpotlightCard from '../ui/SpotlightCard';

const TECH_CATEGORIES = [
  {
    category: 'Frontend & UI Engineering',
    icon: Layers,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    techs: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite']
  },
  {
    category: 'Backend & API Architecture',
    icon: Server,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    techs: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL', 'Microservices']
  },
  {
    category: 'Cross-Platform Mobile',
    icon: Smartphone,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    techs: ['Flutter', 'React Native', 'Dart', 'iOS & Android', 'State Management']
  },
  {
    category: 'Cloud, DevOps & Databases',
    icon: Cloud,
    color: 'text-orange',
    bg: 'bg-orange/10',
    techs: ['PostgreSQL', 'MySQL', 'MongoDB', 'AWS Cloud', 'Docker', 'CI/CD Pipelines']
  }
];

const TechUniverse = () => {
  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#080E1B] transition-colors duration-500 overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Structured Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <ShinyText text="Enterprise Technology Ecosystem" />
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.15] tracking-tight mb-4"
          >
            Built with Modern, Battle-Tested <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
              Software Frameworks.
            </span>
          </motion.h2>

          <p className="text-sm sm:text-base text-navy/70 dark:text-white/70 font-medium leading-relaxed">
            We leverage industry-standard languages, scalable architectures, and modern cloud platforms across our software solutions and internship curriculum.
          </p>
        </div>

        {/* Structured 4-Category Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex"
              >
                <SpotlightCard className="w-full p-6 md:p-7 flex flex-col justify-between bg-grey-light/70 dark:bg-[#0B132B] border-navy/10 dark:border-white/10 shadow-xs hover:shadow-lg transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center font-bold`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-mono font-bold text-navy/40 dark:text-white/40">
                        STACK.0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-display font-extrabold text-navy dark:text-white mb-4">
                      {cat.category}
                    </h3>

                    {/* Tech Pills List */}
                    <div className="flex flex-wrap gap-2">
                      {cat.techs.map((tech) => (
                        <span 
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white dark:bg-[#060B13] text-navy/85 dark:text-white/85 border border-navy/5 dark:border-white/5 shadow-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-navy/10 dark:border-white/10 flex items-center gap-2 text-[11px] font-bold text-navy/60 dark:text-white/60">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>Production Grade</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default TechUniverse;
