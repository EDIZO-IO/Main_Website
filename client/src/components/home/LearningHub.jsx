import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningHub = () => {
  const cards = [
    { title: 'WEB DEVELOPMENT', desc: 'Build real applications.', color: 'bg-orange/10', border: 'border-orange/20', text: 'text-orange' },
    { title: 'FLUTTER DEVELOPMENT', desc: 'Create production-ready mobile apps.', color: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500' },
    { title: 'UI / UX DESIGN', desc: 'Design real digital products.', color: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-500' },
    { title: 'AI & AUTOMATION', desc: 'Build intelligent workflows.', color: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-500' },
  ];

  return (
    <section className="py-24 bg-grey-light">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-extrabold text-navy leading-[1] tracking-tight max-w-2xl"
          >
            LEARN BY <br/> BUILDING <span className="text-orange">REAL PRODUCTS.</span>
          </motion.h2>
          
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Link to="/internships" className="px-8 py-4 bg-white border border-navy/10 text-navy rounded-full font-bold hover:bg-orange hover:text-white hover:border-orange transition-all flex items-center gap-2 shadow-sm">
              EXPLORE INTERNSHIPS <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-[2rem] bg-white border ${card.border} hover:-translate-y-2 transition-transform shadow-sm relative overflow-hidden`}
            >
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${card.color} filter blur-2xl`}></div>
              
              <div className={`w-12 h-12 rounded-2xl ${card.color} ${card.text} flex items-center justify-center mb-12`}>
                <div className="w-6 h-6 border-2 border-current rounded-md"></div>
              </div>

              <h3 className="text-xl font-display font-bold text-navy mb-3 pr-4">{card.title}</h3>
              <p className="text-navy/60 font-medium">{card.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LearningHub;
