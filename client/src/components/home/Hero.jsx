import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[95vh] pt-32 pb-20 overflow-hidden flex items-center bg-grey-light dark:bg-navy">
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0, -100, 0], 
            y: [0, 50, -50, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-orange/20 dark:bg-orange/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0, 100, 0], 
            y: [0, -50, 50, -50, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-display font-extrabold text-navy dark:text-white leading-[1.05] tracking-tight mb-4">
              Turning Ideas Into <br/>
              <span className="text-orange">Digital Experiences.</span>
            </h1>
            
            <p className="text-orange font-bold tracking-widest mb-8 text-sm md:text-base">
              DESIGN • DEVELOP • DELIVER
            </p>
            
            <p className="text-xl md:text-2xl text-navy/70 dark:text-white/70 font-medium leading-relaxed mb-12 max-w-2xl">
              EDIZO is a creative digital agency helping businesses, creators, and aspiring professionals build, grow, and succeed through design, technology, and digital solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/contact" className="group px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy rounded-full font-bold hover:bg-orange dark:hover:bg-orange dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-orange/30 hover:-translate-y-1 overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-2">START A PROJECT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-white/20 dark:bg-navy/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[600px] hidden lg:flex items-center justify-center"
          >
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-full max-w-[500px] glass-card rounded-[3rem] p-3 z-20 overflow-hidden border-[4px] border-white/50 dark:border-navy-light shadow-2xl"
            >
              <img src="/images/EDIZO_Post_01.png" alt="Edizo Intro" className="w-full h-auto object-cover rounded-[2.5rem]" />
            </motion.div>

            {/* Floating Data Card */}
            <motion.div 
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 -left-8 glass-card rounded-[2rem] p-5 flex items-center gap-4 z-40"
            >
              <div className="w-12 h-12 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-xl">50+</div>
              <div>
                <div className="text-base font-bold text-navy dark:text-white">Projects Built</div>
                <div className="text-sm text-navy/50 dark:text-white/50">Across industries</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
