import { motion, useScroll, useTransform } from 'framer-motion';

const Innovation = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section className="py-32 bg-grey-dark relative overflow-hidden text-white">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-1/4 w-1/2 h-[500px] bg-orange rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-[500px] bg-[#4A90E2] rounded-full mix-blend-multiply filter blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight"
            >
              Turning Vision Into <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-light">Digital Reality</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-grey-silver/80 mb-10 leading-relaxed max-w-lg"
            >
              We don't just write code. We architect scalable solutions that disrupt markets and create lasting impact for enterprises and startups alike.
            </motion.p>
            
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="px-8 py-4 bg-transparent border-2 border-orange text-orange hover:bg-orange hover:text-white rounded-full font-bold transition-all duration-300"
            >
              Discover Our Approach
            </motion.button>
          </div>

          <div className="relative h-[600px] hidden md:block">
            {/* Floating Glass Panels */}
            <motion.div 
              style={{ y: y1 }}
              className="absolute top-10 right-10 w-64 h-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange to-orange-dark rounded-xl mb-6" />
              <div className="w-3/4 h-4 bg-white/20 rounded-full mb-3" />
              <div className="w-1/2 h-4 bg-white/20 rounded-full mb-8" />
              <div className="w-full h-32 bg-white/10 rounded-xl" />
            </motion.div>
            
            <motion.div 
              style={{ y: y2 }}
              className="absolute bottom-10 left-10 w-72 h-64 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl z-20"
            >
               <div className="flex justify-between items-center mb-6">
                 <div className="w-10 h-10 bg-blue-500/50 rounded-full" />
                 <div className="w-20 h-8 bg-white/10 rounded-full" />
               </div>
               <div className="space-y-3">
                 <div className="w-full h-3 bg-white/20 rounded-full" />
                 <div className="w-full h-3 bg-white/20 rounded-full" />
                 <div className="w-4/5 h-3 bg-white/20 rounded-full" />
               </div>
               <div className="mt-8 flex gap-2">
                 <div className="w-1/3 h-12 bg-white/10 rounded-lg" />
                 <div className="w-1/3 h-12 bg-white/10 rounded-lg" />
                 <div className="w-1/3 h-12 bg-white/10 rounded-lg" />
               </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Innovation;
