import { motion } from 'framer-motion';

const CompanyIntro = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-grey-light rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-[80px]" />
          
          {/* Left Visual */}
          <div className="w-full lg:w-1/2 relative h-[400px]">
            <div className="absolute inset-0 border border-navy/5 rounded-3xl bg-white/50 backdrop-blur p-2 shadow-inner">
              <img src="/images/digital_product_mockup.png" alt="Digital Product Mockup" className="w-full h-full object-cover rounded-2xl" />
            </div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-navy/5 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">SAAS</div>
              <div className="h-2 w-16 bg-navy/10 rounded"></div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-8 bottom-1/4 bg-white p-4 rounded-xl shadow-xl border border-navy/5 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">AI</div>
              <div className="h-2 w-16 bg-navy/10 rounded"></div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-extrabold text-navy leading-[1.1] mb-8"
            >
              WE TURN IDEAS <br/>
              INTO DIGITAL <br/>
              <span className="text-orange">PRODUCTS.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-navy/60 font-medium leading-relaxed max-w-lg mb-10"
            >
              Edizo transforms ideas into scalable digital products through strategy, design, development and cutting-edge technology. We don't just write code; we engineer solutions.
            </motion.p>
            
            <div className="flex flex-wrap gap-3">
              {['WEB', 'MOBILE', 'SAAS', 'AI', 'CLOUD'].map((label, idx) => (
                <motion.div 
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (idx * 0.05) }}
                  className="px-5 py-2 rounded-full border border-navy/10 text-sm font-bold text-navy bg-white hover:bg-navy hover:text-white transition-colors cursor-default"
                >
                  {label}
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
