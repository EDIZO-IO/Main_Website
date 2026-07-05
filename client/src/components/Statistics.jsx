import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const Counter = ({ from, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

const Statistics = () => {
  const stats = [
    { value: 150, suffix: "+", label: "Projects Delivered" },
    { value: 50, suffix: "+", label: "Clients Served" },
    { value: 30, suffix: "+", label: "Technologies Mastered" },
    { value: 500, suffix: "+", label: "Internships Completed" }
  ];

  return (
    <section className="py-24 bg-grey-dark text-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              <div className="text-5xl md:text-6xl font-display font-bold text-orange mb-2 flex items-center justify-center">
                <Counter from={0} to={stat.value} />{stat.suffix}
              </div>
              <p className="text-lg text-grey-silver/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
