import { motion } from 'framer-motion';
import { ArrowRight, Code2, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShinyText from '../ui/ShinyText';
import Magnet from '../ui/Magnet';
import TypewriterText from '../ui/TypewriterText';
import SplitText from '../ui/SplitText';

const CTA = () => {
  return (
    <section className="py-16 sm:py-20 bg-grey-light dark:bg-[#060B13] transition-colors duration-500 relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Subtle Background Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-10 dark:opacity-5 pointer-events-none">
        <div className="w-[1000px] h-[1000px] rounded-full border border-navy/30 dark:border-white/30 absolute" />
        <div className="w-[700px] h-[700px] rounded-full border border-navy/40 dark:border-white/40 absolute" />
        <div className="w-[400px] h-[400px] rounded-full border border-orange absolute" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-4">
          <Sparkles size={14} />
          <TypewriterText 
            texts={[
              "Start Building Your Vision",
              "Design • Develop • Deliver",
              "Scale Your Digital Footprint",
              "Launch Your Engineering Career"
            ]}
            typingSpeed={60}
            deletingSpeed={30}
            pauseDuration={2400}
          />
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-navy dark:text-white leading-[1.08] tracking-tight mb-6"
        >
          Have a Project Idea or Want to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
            Launch Your Tech Career?
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-navy/70 dark:text-white/70 font-medium leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Partner with EDIZO to engineer scalable software for your company, or join our hands-on industrial internship programs to build real-world products.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center items-center"
        >
          <Magnet padding={20} magnetStrength={3}>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:shadow-xl hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 shadow-md"
            >
              <Code2 size={18} />
              <span>Start A Project</span>
              <ArrowRight size={16} />
            </Link>
          </Magnet>

          <Magnet padding={20} magnetStrength={3}>
            <Link 
              to="/internships" 
              className="px-8 py-4 bg-white dark:bg-[#0B132B] text-navy dark:text-white border-2 border-navy/15 dark:border-white/15 rounded-full font-bold text-sm uppercase tracking-wider hover:border-[#D93800] dark:hover:border-[#FF5A1F] hover:text-[#D93800] dark:hover:text-[#FF855C] transition-all flex items-center gap-2.5 shadow-xs"
            >
              <GraduationCap size={18} className="text-orange" />
              <span>Apply for Internship</span>
              <ArrowRight size={16} />
            </Link>
          </Magnet>
        </motion.div>

      </div>
    </section>
  );
};

export default CTA;
