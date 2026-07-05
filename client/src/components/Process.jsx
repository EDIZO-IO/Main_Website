import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    "Research", "Strategy", "Design", "Development", "Testing", "Deployment", "Growth"
  ];

  return (
    <section className="py-24 bg-white relative">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-orange/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            Our <span className="text-gradient">Work Process</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-grey-medium max-w-2xl mx-auto"
          >
            A systematic approach to transforming ideas into successful digital products.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 md:px-0">
          {/* Background Connecting Line (Static) */}
          <div className="hidden md:block absolute top-6 left-[4%] w-[92%] h-1 bg-grey-silver -translate-y-1/2 rounded-full" />
          
          {/* Animated Connecting Line (Fills up) */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className="hidden md:block absolute top-6 left-[4%] w-[92%] h-1 bg-gradient-to-r from-orange to-orange-dark origin-left -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(255,106,61,0.5)] z-0" 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-10 md:gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.3 + (index * 0.15), 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
                className="flex flex-col items-center group cursor-default"
              >
                <div className="w-12 h-12 rounded-full bg-white border-[3px] border-grey-silver flex items-center justify-center font-bold text-grey-medium mb-6 group-hover:border-orange group-hover:text-orange transition-all duration-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(255,106,61,0.3)] group-hover:scale-110 relative z-10">
                  {/* Inner glowing dot on hover */}
                  <div className="absolute inset-1 rounded-full bg-orange opacity-0 group-hover:opacity-10 transition-opacity" />
                  {index + 1}
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (index * 0.15) }}
                  className="bg-white px-4 py-2 rounded-xl shadow-sm border border-grey-silver/50 group-hover:border-orange/30 group-hover:shadow-md transition-all text-center"
                >
                  <h4 className="font-bold text-grey-dark group-hover:text-orange transition-colors text-sm md:text-base whitespace-nowrap">
                    {step}
                  </h4>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
