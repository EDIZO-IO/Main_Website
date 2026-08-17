import { motion } from 'framer-motion';

const ClientMarquee = () => {
  // Mock company logos as text for now, but stylized to look like logos
  const clients = [
    "ACME CORP", "GLOBAL TECH", "INNOVATE.IO", "FUTURE SYSTEMS",
    "NEXUS", "HORIZON DATA", "QUANTUM", "STELLAR MEDIA"
  ];
  
  // Duplicate array for infinite scroll effect without gap
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="py-12 bg-white dark:bg-navy border-b border-navy/5 dark:border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-6">
         <p className="text-center text-xs font-bold tracking-widest text-navy/40 dark:text-white/40 uppercase">Trusted by forward-thinking companies</p>
      </div>
      
      <div className="relative w-full flex">
        {/* Left fade out gradient */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-navy to-transparent z-10 pointer-events-none"></div>
        
        {/* Right fade out gradient */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-navy to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {marqueeItems.map((client, idx) => (
            <div 
              key={`${client}-${idx}`} 
              className="mx-12 lg:mx-20 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="font-display font-extrabold text-2xl tracking-tighter text-navy dark:text-white">{client}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientMarquee;
