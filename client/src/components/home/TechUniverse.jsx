import { motion } from 'framer-motion';

const TechUniverse = () => {
  return (
    <section className="py-32 bg-white overflow-hidden relative">
      <div className="container mx-auto px-6 text-center relative z-10">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-[#0a1128] mb-24 tracking-tight"
        >
          Built with the right technology.
        </motion.h2>

        <div className="relative w-[300px] h-[300px] md:w-[700px] md:h-[700px] mx-auto flex items-center justify-center">
          
          {/* Outermost Orbit */}
          <div className="absolute w-[90%] h-[90%] md:w-[700px] md:h-[700px] border border-gray-100 rounded-full" />

          {/* Middle Orbit */}
          <div className="absolute w-[60%] h-[60%] md:w-[480px] md:h-[480px] border border-gray-100 rounded-full" />
          
          {/* Inner Orbit (Dashed) */}
          <div className="absolute w-[40%] h-[40%] md:w-[320px] md:h-[320px] border border-dashed border-gray-200 rounded-full animate-[spin_40s_linear_infinite]" />

          {/* Center Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="absolute w-28 h-28 md:w-36 md:h-36 bg-white rounded-full flex items-center justify-center z-30"
            style={{ boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
          >
             <span className="font-display font-bold text-xl md:text-3xl text-[#0a1128] tracking-widest">EDIZO</span>
          </motion.div>

          {/* Orbiting Dot 1 */}
          <div className="absolute w-full h-full animate-[spin_20s_linear_infinite]">
             <div className="absolute top-1/2 right-[15%] md:right-[95px] -mt-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-50 z-40 animate-[spin_20s_linear_infinite_reverse]">
                <div className="w-2 h-2 rounded-full bg-orange"></div>
             </div>
          </div>
          
          {/* Orbiting Dot 2 (Optional, subtle) */}
          <div className="absolute w-full h-full animate-[spin_35s_linear_infinite_reverse]">
             <div className="absolute bottom-[20%] left-[20%] md:left-[100px] md:bottom-[150px] -mt-3 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50 z-40 animate-[spin_35s_linear_infinite]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TechUniverse;
