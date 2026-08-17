import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';

const fallbackTestimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "CTO",
    company: "TechFlow",
    content: "EDIZO didn't just build our app; they completely reimagined our digital strategy. Their attention to detail and engineering quality is unmatched.",
    image_url: "https://i.pravatar.cc/150?img=47"
  },
  {
    id: 2,
    name: "Marcus Aurelius",
    role: "Founder",
    company: "Zenith",
    content: "Working with EDIZO was a game-changer for our startup. They delivered a highly complex SaaS platform ahead of schedule and with a stunning UI.",
    image_url: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "VP Marketing",
    company: "GlobalReach",
    content: "The web experience they designed for us has increased our conversion rate by 40%. The team is brilliant, communicative, and truly cares about the product.",
    image_url: "https://i.pravatar.cc/150?img=5"
  }
];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.length > 0 ? data : fallbackTestimonials);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
     return (
       <section className="py-32 bg-grey-light dark:bg-navy flex items-center justify-center min-h-[600px]">
         <Loader2 className="w-10 h-10 animate-spin text-orange" />
       </section>
     );
  }

  return (
    <section className="py-32 bg-grey-light dark:bg-navy relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white dark:bg-navy-light rounded-l-[5rem] hidden lg:block border-y border-l border-navy/5 dark:border-white/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.1] tracking-tight mb-8"
            >
              DON'T JUST <br/> TAKE OUR <span className="text-orange">WORD.</span>
            </motion.h2>
            <p className="text-xl text-navy/60 dark:text-white/60 font-medium mb-12">
              Hear from the founders and leaders who have partnered with us to build their digital products.
            </p>
            
            <div className="flex gap-4">
               <button 
                 onClick={prevTestimonial}
                 className="w-14 h-14 rounded-full border border-navy/10 dark:border-white/10 flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-all group"
               >
                 <ChevronLeft className="text-navy dark:text-white group-hover:text-white transition-colors" />
               </button>
               <button 
                 onClick={nextTestimonial}
                 className="w-14 h-14 rounded-full border border-navy/10 dark:border-white/10 flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-all group"
               >
                 <ChevronRight className="text-navy dark:text-white group-hover:text-white transition-colors" />
               </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full min-h-[350px]">
             <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 text-orange/10 dark:text-orange/5 z-0">
                <Quote size={80} />
             </div>
             
             <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-white dark:bg-navy-light p-8 md:p-10 rounded-3xl shadow-xl border border-navy/5 dark:border-white/5 relative z-10 w-full"
                >
                  <p className="text-xl md:text-2xl font-display font-bold text-navy dark:text-white leading-relaxed mb-10">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                     {testimonials[currentIndex].image_url ? (
                       <img src={testimonials[currentIndex].image_url} alt={testimonials[currentIndex].name} className="w-16 h-16 rounded-full object-cover border-2 border-orange" />
                     ) : (
                       <div className="w-16 h-16 rounded-full bg-navy/10 dark:bg-white/10 border-2 border-orange flex items-center justify-center font-bold text-xl text-navy dark:text-white">
                         {testimonials[currentIndex].name.charAt(0)}
                       </div>
                     )}
                     <div>
                        <h4 className="font-bold text-lg text-navy dark:text-white">{testimonials[currentIndex].name}</h4>
                        <p className="text-navy/60 dark:text-white/60 font-medium text-sm">
                          {testimonials[currentIndex].role} {testimonials[currentIndex].company && `, ${testimonials[currentIndex].company}`}
                        </p>
                     </div>
                  </div>
                </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
