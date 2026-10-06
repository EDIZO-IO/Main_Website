import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Code, GraduationCap, Cpu, ShieldCheck } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import SpotlightCard from '../ui/SpotlightCard';

const AnimatedCounter = ({ value, suffix = '', label, sublabel, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  
  const spring = useSpring(0, {
    mass: 0.8,
    stiffness: 45,
    damping: 14,
  });

  const display = useTransform(spring, (current) => Math.floor(current) + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <SpotlightCard className="p-6 md:p-8 flex flex-col justify-between h-full bg-white dark:bg-[#0B132B]/90 border-navy/10 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300">
      <div ref={ref}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange/15 text-[#D93800] dark:text-[#FF855C] flex items-center justify-center">
            <Icon size={20} />
          </div>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        
        <motion.h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-navy dark:text-white tracking-tight leading-none mb-2">
          {display}
        </motion.h3>
        
        <div className="text-sm font-bold text-navy dark:text-white">
          {label}
        </div>
        <div className="text-xs text-navy/70 dark:text-white/70 font-medium mt-0.5">
          {sublabel}
        </div>
      </div>
    </SpotlightCard>
  );
};

const Statistics = () => {
  const { settings: config } = useSite();
  const projectsCount = parseInt(config?.stat_projects || '50', 10);
  const techCount = parseInt(config?.stat_technologies || '12', 10);
  const internsCount = parseInt(config?.stat_interns_count || '150', 10);

  return (
    <section className="py-12 sm:py-14 bg-grey-light dark:bg-[#060B13] transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedCounter 
            value={projectsCount} 
            suffix="+" 
            label="Software Projects" 
            sublabel="Web, Apps & Cloud Delivered" 
            icon={Code} 
          />
          <AnimatedCounter 
            value={techCount} 
            suffix="+" 
            label="Tech Stacks" 
            sublabel="Modern Frameworks & APIs" 
            icon={Cpu} 
          />
          <AnimatedCounter 
            value={internsCount} 
            suffix="+" 
            label="Engineers Mentored" 
            sublabel="Real-World Industrial Internships" 
            icon={GraduationCap} 
          />
          <AnimatedCounter 
            value={99} 
            suffix="%" 
            label="Client & Student Trust" 
            sublabel="Verified Code & Industry Badges" 
            icon={ShieldCheck} 
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;
