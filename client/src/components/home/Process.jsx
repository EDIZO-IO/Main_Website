import { motion } from 'framer-motion';
import { useState } from 'react';

const Process = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    { id: '01', title: 'DISCOVER', desc: 'Understand the problem.', nodeIndex: 0 },
    { id: '02', title: 'DESIGN', desc: 'Create the experience.', nodeIndex: 1 },
    { id: '03', title: 'DEVELOP', desc: 'Build the product.', nodeIndex: 2 },
    { id: '04', title: 'LAUNCH', desc: 'Release and validate.', nodeIndex: 3 },
    { id: '05', title: 'GROW', desc: 'Improve and scale.', nodeIndex: 3 },
  ];

  return (
    <section className="py-32 bg-white" id="how-we-work">
      <div className="container mx-auto px-6">
        
        <div className="bg-navy rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange/10 via-navy to-navy pointer-events-none" />
          
          <div className="relative z-10 mb-20 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-display font-extrabold text-white leading-[1.1] tracking-tight"
            >
              FROM IDEA <br/> TO <span className="text-orange">IMPACT.</span>
            </motion.h2>
          </div>

          <div className="relative z-10 hidden md:block mb-32 mt-16 max-w-4xl mx-auto">
            {/* Central visual of evolving software product */}
            <div className="w-full h-[300px] border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur flex items-center justify-between p-8 relative">
              <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-white/10 -translate-y-1/2 z-0 overflow-hidden rounded-full">
                {/* Animated progress line */}
                <motion.div 
                  className="w-1/3 h-full bg-gradient-to-r from-transparent via-orange to-transparent opacity-50"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Node 1: Idea (Wireframe) */}
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 3, repeat: Infinity }} 
                className={`w-32 h-40 bg-white/5 border border-white/20 rounded-xl z-10 flex flex-col p-3 shadow-lg backdrop-blur gap-2 transition-all duration-300 ${activeStep === 0 ? 'ring-2 ring-orange scale-110 shadow-orange/20' : activeStep !== null ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="w-full h-2 bg-white/20 rounded"></div>
                <div className="w-full flex-1 border border-white/10 rounded flex items-center justify-center text-white/30 text-xs">Idea</div>
              </motion.div>
              
              {/* Node 2: Design (Figma-like) */}
              <motion.div 
                animate={{ y: [0, 5, 0] }} 
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} 
                className={`w-40 h-48 bg-[#1E1E1E] border border-[#333] rounded-xl z-10 flex flex-col p-1 shadow-2xl relative transition-all duration-300 ${activeStep === 1 ? 'ring-2 ring-orange scale-110 shadow-orange/20 z-20' : activeStep !== null ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="w-full h-6 bg-[#2D2D2D] rounded-t-lg flex items-center px-2 gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56]"></div><div className="w-2 h-2 rounded-full bg-[#FFBD2E]"></div><div className="w-2 h-2 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="flex-1 bg-[#121212] rounded-b-lg p-2 grid grid-cols-2 gap-2">
                  <div className="w-full h-full border border-white/10 rounded bg-white/5"></div>
                  <div className="w-full h-full border border-orange/40 rounded bg-orange/10 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-orange text-orange rotate-45 text-[8px] flex items-center justify-center">+</div>
                  </div>
                </div>
              </motion.div>

              {/* Node 3: Code (VS Code like) */}
              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }} 
                className={`w-48 h-56 bg-[#0D1117] border border-[#30363D] rounded-xl z-10 flex flex-col p-0 shadow-2xl overflow-hidden relative scale-110 transition-all duration-300 ${activeStep === 2 ? 'ring-2 ring-orange scale-125 shadow-orange/20 z-20' : activeStep !== null ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="w-full h-6 bg-[#161B22] flex items-center px-3 border-b border-[#30363D]">
                    <div className="text-[10px] text-[#8B949E] font-mono">App.tsx</div>
                </div>
                <div className="flex-1 p-3 space-y-2">
                    <div className="w-3/4 h-2 bg-[#FF7B72] rounded"></div>
                    <div className="w-1/2 h-2 bg-[#79C0FF] rounded ml-4"></div>
                    <div className="w-2/3 h-2 bg-[#D2A8FF] rounded ml-4"></div>
                    <div className="w-1/3 h-2 bg-[#A5D6FF] rounded ml-8"></div>
                    <div className="w-1/2 h-2 bg-[#79C0FF] rounded ml-4"></div>
                    <div className="w-1/4 h-2 bg-[#FF7B72] rounded"></div>
                </div>
              </motion.div>

              {/* Node 4: Live Product (Browser) */}
              <motion.div 
                animate={{ y: [0, 6, 0] }} 
                transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }} 
                className={`w-56 h-64 bg-white rounded-xl z-10 flex flex-col p-1 shadow-2xl overflow-hidden relative text-navy transition-all duration-300 ${activeStep === 3 ? 'ring-4 ring-orange scale-110 shadow-orange/30 z-20' : activeStep !== null ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="w-full h-8 bg-grey-silver/50 rounded-t-lg flex items-center px-3 gap-2">
                    <div className="w-16 h-3 bg-white rounded"></div>
                    <div className="flex-1 h-4 bg-white rounded-md mx-2"></div>
                </div>
                <div className="flex-1 bg-white p-3 flex flex-col gap-3">
                    <div className="w-full h-24 bg-orange/10 rounded-lg flex items-center justify-center"><div className="w-16 h-4 bg-orange rounded"></div></div>
                    <div className="grid grid-cols-2 gap-2 flex-1">
                        <div className="w-full h-full bg-grey-light rounded-lg"></div>
                        <div className="w-full h-full bg-grey-light rounded-lg"></div>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Steps Horizontal Flow */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:gap-4 border-t border-white/10 pt-12">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`flex-1 relative p-4 rounded-xl cursor-pointer transition-colors duration-300 ${activeStep === step.nodeIndex ? 'bg-white/5' : 'hover:bg-white/5'}`}
                onMouseEnter={() => setActiveStep(step.nodeIndex)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className={`font-display font-bold text-xl mb-4 transition-colors duration-300 ${activeStep === step.nodeIndex ? 'text-orange scale-110 origin-left' : 'text-orange/70'}`}>
                  {step.id}
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{step.title}</h4>
                <p className="text-white/50 text-sm font-medium">{step.desc}</p>
                {idx !== steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-16 w-[calc(100%-2rem)] h-[1px] bg-white/10" />
                )}
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Process;
