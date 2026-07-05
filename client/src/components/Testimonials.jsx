import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      text: "EDIZO completely transformed our digital presence. Their attention to detail and technical expertise is unmatched in the industry.",
      author: "Sarah Jenkins",
      role: "CTO, TechFlow Solutions",
      company: "TechFlow"
    },
    {
      text: "The team's ability to understand our business needs and translate them into a highly scalable platform was impressive. Highly recommended.",
      author: "Michael Chang",
      role: "Founder, RetailPro",
      company: "RetailPro"
    },
    {
      text: "From design to deployment, the process was seamless. The final product exceeded our expectations in both performance and aesthetics.",
      author: "Elena Rodriguez",
      role: "Product Manager, Innovate AI",
      company: "Innovate AI"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Client <span className="text-gradient">Success</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-0 -left-8 text-orange/20 -z-10">
            <Quote size={120} />
          </div>
          
          <div className="h-[300px] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-2xl md:text-3xl font-display text-grey-dark leading-relaxed mb-10">
                  "{testimonials[currentIndex].text}"
                </p>
                <div>
                  <h4 className="font-bold text-xl text-grey-dark">{testimonials[currentIndex].author}</h4>
                  <p className="text-orange font-medium">{testimonials[currentIndex].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-grey-silver flex items-center justify-center text-grey-dark hover:bg-orange hover:text-white hover:border-orange transition-colors">
              <ChevronLeft />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-8 bg-orange' : 'w-2 bg-grey-silver'}`}
                />
              ))}
            </div>
            <button onClick={handleNext} className="w-12 h-12 rounded-full border border-grey-silver flex items-center justify-center text-grey-dark hover:bg-orange hover:text-white hover:border-orange transition-colors">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
