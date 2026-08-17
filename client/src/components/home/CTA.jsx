import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-40 bg-grey-light relative overflow-hidden flex flex-col items-center justify-center text-center">
      
      {/* Background Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-10 pointer-events-none">
         <div className="w-[1200px] h-[1200px] rounded-full border border-navy/20 absolute"></div>
         <div className="w-[800px] h-[800px] rounded-full border border-navy/30 absolute"></div>
         <div className="w-[400px] h-[400px] rounded-full border border-navy/40 absolute"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl lg:text-[7rem] font-display font-extrabold text-navy leading-[0.9] tracking-tighter mb-8"
        >
          HAVE AN IDEA? <br/>
          <span className="text-orange">LET'S BUILD IT.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-navy/60 font-medium leading-relaxed max-w-2xl mx-auto mb-16"
        >
          Tell us what you're building. We'll help turn your idea into a scalable digital product.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <Link to="/contact" className="px-10 py-5 bg-navy text-white rounded-full font-bold hover:bg-orange transition-all flex items-center justify-center gap-2 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1">
            START A PROJECT <ArrowRight size={20} />
          </Link>
          <Link to="/contact" className="px-10 py-5 bg-white text-navy border border-navy/10 rounded-full font-bold hover:bg-grey-silver transition-all flex items-center justify-center text-lg">
            TALK TO EDIZO
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default CTA;
