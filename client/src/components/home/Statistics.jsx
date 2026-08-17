import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

const AnimatedCounter = ({ value, suffix = '', label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 50,
    damping: 15,
  });

  const display = useTransform(spring, (current) => Math.floor(current) + suffix);

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-2"
    >
      <motion.h3 className="text-5xl md:text-7xl lg:text-[5rem] font-display font-extrabold text-navy dark:text-white tracking-tighter leading-none">
        {display}
      </motion.h3>
      <p className="text-navy/40 dark:text-white/40 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mt-2">
        {label}
      </p>
    </motion.div>
  );
};

const StaticStat = ({ text, label }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-2"
    >
      <h3 className="text-4xl md:text-6xl lg:text-[4rem] font-display font-extrabold text-navy dark:text-white tracking-tighter leading-none whitespace-nowrap">
        {text}
      </h3>
      <p className="text-navy/40 dark:text-white/40 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mt-2">
        {label}
      </p>
    </motion.div>
  );
}

const Statistics = () => {
  return (
    <section className="py-24 bg-white dark:bg-navy">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 border-y border-navy/10 dark:border-white/10 py-16">
          <AnimatedCounter value={50} suffix="+" label="PROJECTS BUILT" />
          <AnimatedCounter value={10} suffix="+" label="TECHNOLOGIES" />
          <StaticStat text="MULTIPLE" label="DIGITAL PRODUCTS" />
          <AnimatedCounter value={1} suffix="" label="CONNECTED ECOSYSTEM" />
        </div>
      </div>
    </section>
  );
};

export default Statistics;
