import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events = () => {
  const events = [
    { id: '01', title: 'TECH WORKSHOP', desc: 'Build modern web applications', link: '/contact' },
    { id: '02', title: 'AI DEVELOPMENT SESSION', desc: 'Explore practical AI', link: '/contact' },
    { id: '03', title: 'DESIGN WORKSHOP', desc: 'Learn product design', link: '/contact' },
    { id: '04', title: 'DEVELOPER MEETUP', desc: 'Build. Learn. Connect.', link: '/contact' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        
        <div className="flex justify-center items-center gap-6 mb-24 opacity-20">
           <div className="w-12 h-12 border-[8px] border-dashed border-navy rounded-full animate-[spin_10s_linear_infinite]"></div>
           <h2 className="text-4xl md:text-5xl font-display font-bold text-navy tracking-widest lowercase">edizo community</h2>
           <div className="w-12 h-12 border-[8px] border-dashed border-navy rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
        </div>

        <div className="flex flex-col">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-navy/10 group hover:bg-grey-light/50 transition-colors px-4 -mx-4 rounded-2xl"
            >
              <div className="flex items-start md:items-center gap-6 md:gap-12 mb-6 md:mb-0">
                <span className="text-sm font-bold text-navy/40 w-8">{event.id}</span>
                <div>
                  <h3 className="text-3xl md:text-4xl font-display font-extrabold text-navy tracking-tight mb-2 group-hover:text-orange transition-colors">{event.title}</h3>
                  <p className="text-navy/50 font-medium">{event.desc}</p>
                </div>
              </div>
              
              <Link to={event.link} className="px-6 py-3 border border-navy/20 rounded-full text-navy font-bold text-sm hover:bg-orange hover:text-white hover:border-orange transition-all flex items-center gap-2 self-start md:self-auto shadow-sm group-hover:shadow-md">
                JOIN <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Events;
