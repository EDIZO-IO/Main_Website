import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/testimonials`, { signal: controller.signal });
        if (response.ok) {
          const data = await response.json();
          setTestimonials(Array.isArray(data) ? data : []);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch testimonials:", err);
          setTestimonials([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
    return () => controller.abort();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-14 sm:py-16 bg-grey-light dark:bg-[#060B13] transition-colors duration-500 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white dark:bg-[#0B132B] rounded-l-[4rem] hidden lg:block border-y border-l border-navy/5 dark:border-white/5" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-navy dark:text-white leading-[1.1] tracking-tight mb-4"
            >
              WHAT OUR <br/> PARTNERS <span className="text-[#D93800] dark:text-[#FF855C]">SAY.</span>
            </motion.h2>
            <p className="text-base sm:text-lg text-navy/75 dark:text-white/75 font-medium mb-8">
              Hear from founders, clients, and talented engineers who have built their systems and careers with EDIZO.
            </p>
            
            <div className="flex gap-4">
               <button 
                 type="button"
                 onClick={prevTestimonial}
                 aria-label="Previous testimonial"
                 className="w-14 h-14 rounded-full border border-navy/10 dark:border-white/10 flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-all group focus:outline-none focus:ring-2 focus:ring-orange"
               >
                 <ChevronLeft className="text-navy dark:text-white group-hover:text-white transition-colors" aria-hidden="true" />
               </button>
               <button 
                 type="button"
                 onClick={nextTestimonial}
                 aria-label="Next testimonial"
                 className="w-14 h-14 rounded-full border border-navy/10 dark:border-white/10 flex items-center justify-center hover:bg-orange hover:text-white hover:border-orange transition-all group focus:outline-none focus:ring-2 focus:ring-orange"
               >
                 <ChevronRight className="text-navy dark:text-white group-hover:text-white transition-colors" aria-hidden="true" />
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
                        <h3 className="font-bold text-lg text-navy dark:text-white">{testimonials[currentIndex].name}</h3>
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
