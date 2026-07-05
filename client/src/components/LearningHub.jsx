import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Trophy, Target } from 'lucide-react';

const LearningHub = () => {
  const programs = [
    { icon: <BookOpen />, title: "Training Programs", desc: "Master modern tech stacks with industry experts." },
    { icon: <Users />, title: "Internships", desc: "Gain real-world experience on live production projects." },
    { icon: <Trophy />, title: "Skill Development", desc: "Continuous learning paths for modern software engineering." },
    { icon: <Target />, title: "Career Guidance", desc: "Mentorship to help you navigate the tech industry." }
  ];

  return (
    <section id="learning" className="py-24 bg-orange text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 font-medium tracking-wider text-sm mb-6 uppercase">
              Edizo Academy
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
              Empowering the Next Generation of Builders
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              We don't just build software; we build careers. Join our intensive learning programs and internships to bridge the gap between academia and the tech industry.
            </p>
            <button className="px-8 py-4 bg-white text-orange hover:bg-grey-light rounded-full font-bold transition-colors shadow-lg flex items-center gap-2">
              Explore Programs <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {programs.map((prog, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 bg-white text-orange rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  {prog.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{prog.title}</h3>
                <p className="text-white/70">{prog.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default LearningHub;
