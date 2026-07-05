import { motion } from 'framer-motion';

const TechUniverse = () => {
  const allTechs = [
    "React", "Next.js", "Vue.js", "Flutter", "Tailwind CSS",
    "Node.js", "Express", "Python", "Django", "Go",
    "PostgreSQL", "MongoDB", "MySQL", "Redis", "Supabase",
    "AWS", "Docker", "Kubernetes", "Cloudflare", "Vercel"
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-y border-grey-silver/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Our <span className="text-gradient">Technology Universe</span>
          </h2>
          <p className="text-xl text-grey-medium max-w-2xl mx-auto">
            We utilize cutting-edge technologies to build fast, secure, and scalable digital solutions.
          </p>
        </div>
      </div>

      <div className="relative w-full flex overflow-x-hidden pt-8 pb-12">
        {/* Left and Right Fade overlays */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <motion.div 
          className="flex whitespace-nowrap gap-8 px-4"
          animate={{ x: [0, -1920] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        >
          {/* Double the array for infinite seamless scroll */}
          {[...allTechs, ...allTechs].map((tech, index) => (
            <div 
              key={index}
              className="premium-card px-8 py-4 rounded-2xl flex items-center justify-center shrink-0 min-w-[150px]"
            >
              <span className="text-xl font-bold text-grey-dark">{tech}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechUniverse;
