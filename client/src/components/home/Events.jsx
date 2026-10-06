import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, Users, Cpu, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import ShinyText from '../ui/ShinyText';

const Events = () => {
  const events = [
    { id: '01', title: 'FULL-STACK WEB WORKSHOP', desc: 'Modern architecture, React 19, and cloud deployment pipelines.', icon: Rocket, link: '/contact' },
    { id: '02', title: 'AI ENGINEERING & API MASTERCLASS', desc: 'Hands-on AI integration, embeddings, and real-time backend systems.', icon: Cpu, link: '/contact' },
    { id: '03', title: 'MOBILE APP DEV BOOTCAMP', desc: 'Building cross-platform iOS & Android solutions with Flutter.', icon: Users, link: '/internships' },
    { id: '04', title: 'OPEN DEV & CAREER MENTORSHIP', desc: 'Code reviews, portfolio audits, and tech industry career launchpad.', icon: Calendar, link: '/internships' },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white dark:bg-[#080E1B] transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Structured Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] font-bold text-xs uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            <ShinyText text="Developer Community & Workshops" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white tracking-tight mb-3">
            Interactive Tech Sessions & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D93800] via-[#FF5A1F] to-[#FF855C]">
              Developer Masterclasses.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-navy/70 dark:text-white/70 font-medium">
            Learn directly from active software engineers through live coding sessions, architectural deep dives, and internship orientations.
          </p>
        </div>

        {/* Structured Events List */}
        <div className="flex flex-col divide-y divide-navy/10 dark:divide-white/10">
          {events.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="flex flex-col md:flex-row md:items-center justify-between py-8 group hover:bg-grey-light/60 dark:hover:bg-[#0B132B]/60 transition-all px-6 -mx-6 rounded-2xl"
              >
                <div className="flex items-start md:items-center gap-5 mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 font-bold">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#D93800] dark:text-[#FF855C]">SESSION.{event.id}</span>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-navy dark:text-white tracking-tight group-hover:text-orange transition-colors">
                        {event.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-navy/65 dark:text-white/65 font-medium mt-1">
                      {event.desc}
                    </p>
                  </div>
                </div>
                
                <Link 
                  to={event.link} 
                  className="px-6 py-2.5 border-2 border-navy/15 dark:border-white/15 rounded-full text-navy dark:text-white font-bold text-xs uppercase tracking-wider hover:border-orange hover:bg-orange hover:text-white dark:hover:border-orange dark:hover:bg-orange dark:hover:text-white transition-all flex items-center gap-2 self-start md:self-auto shrink-0 shadow-xs"
                >
                  <span>Join Session</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Events;
