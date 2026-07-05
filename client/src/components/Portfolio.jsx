import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Portfolio = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  const projects = [
    { title: "FinTech Dashboard", category: "SaaS Product", color: "from-blue-500 to-indigo-600" },
    { title: "HealthCare App", category: "Mobile App", color: "from-emerald-400 to-teal-500" },
    { title: "Global Supply Chain", category: "Enterprise Platform", color: "from-orange to-orange-dark" },
    { title: "AI Image Generator", category: "Web Application", color: "from-purple-500 to-pink-500" },
    { title: "Modern Retailer", category: "E-Commerce", color: "from-rose-400 to-red-500" }
  ];

  return (
    <section ref={targetRef} id="work" className="relative h-[300vh] bg-grey-light">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-6 absolute top-20 left-0 w-full z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Immersive <span className="text-gradient">Experiences</span>
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-6 mt-20">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="w-[80vw] md:w-[60vw] lg:w-[40vw] h-[60vh] shrink-0 rounded-3xl overflow-hidden relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Abstract 3D shape representation inside project card */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                 <div className="w-64 h-64 bg-white rounded-full blur-3xl mix-blend-overlay" />
              </div>

              <div className="absolute inset-0 p-10 flex flex-col justify-end glass m-4 rounded-2xl border border-white/20 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-white/80 font-medium mb-2 uppercase tracking-wider text-sm">{project.category}</span>
                <h3 className="text-3xl font-display font-bold text-white mb-6">{project.title}</h3>
                <div className="flex items-center text-white font-medium gap-2">
                  View Case Study <ArrowRight size={18} />
                </div>
              </div>
              
              {/* Default view */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-white/80 font-medium mb-2 uppercase tracking-wider text-sm">{project.category}</span>
                <h3 className="text-3xl font-display font-bold text-white">{project.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
