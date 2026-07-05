import { motion } from 'framer-motion';
import { Code, Smartphone, Palette, Lightbulb, GraduationCap } from 'lucide-react';

const Intro = () => {
  const cards = [
    { icon: <Code size={32} />, title: 'Technology Partner', delay: 0.1 },
    { icon: <Smartphone size={32} />, title: 'Product Builder', delay: 0.2 },
    { icon: <Palette size={32} />, title: 'Design Studio', delay: 0.3 },
    { icon: <Lightbulb size={32} />, title: 'Innovation Hub', delay: 0.4 },
    { icon: <GraduationCap size={32} />, title: 'Learning Platform', delay: 0.5 },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            More Than A <span className="text-gradient">Development Company</span>
          </h2>
          <p className="text-xl text-grey-medium">
            We are an ecosystem of digital excellence, merging world-class engineering with stunning design and continuous learning.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: card.delay, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass p-8 rounded-2xl flex flex-col items-center text-center w-full md:w-[calc(33.333%-2rem)] lg:w-[calc(20%-2rem)] min-w-[200px] border border-grey-silver bg-gradient-to-b from-white to-grey-light hover:border-orange transition-colors group cursor-pointer relative"
            >
              <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center text-orange mb-4 group-hover:bg-orange group-hover:text-white transition-colors duration-300">
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-grey-dark group-hover:text-orange transition-colors">
                {card.title}
              </h3>
              
              {/* Connecting line for desktop (except last) */}
              {index < cards.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-12 w-12 h-[2px] bg-gradient-to-r from-orange/20 to-transparent transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Intro;
