import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Clock, TrendingUp, HeartHandshake } from 'lucide-react';

const WhyEdizo = () => {
  const features = [
    { icon: <Cpu />, title: "Modern Stack", desc: "We use the latest technologies to ensure your product is future-proof." },
    { icon: <TrendingUp />, title: "Scalable Solutions", desc: "Architectures designed to grow seamlessly with your business." },
    { icon: <Zap />, title: "Fast Execution", desc: "Agile methodologies for rapid delivery without compromising quality." },
    { icon: <Shield />, title: "Business-Focused", desc: "We align our technical strategies with your core business objectives." },
    { icon: <HeartHandshake />, title: "Long-Term Support", desc: "We stay with you post-launch to maintain and scale your platform." },
    { icon: <Clock />, title: "Creative Thinking", desc: "Innovative approaches to solve complex technical challenges." }
  ];

  return (
    <section id="company" className="py-24 bg-grey-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Why Choose <span className="text-gradient">EDIZO</span>
          </h2>
          <p className="text-xl text-grey-medium max-w-2xl mx-auto">
            We deliver excellence by combining technical mastery with deep business understanding.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-8 rounded-3xl group"
            >
              <div className="w-14 h-14 bg-grey-light rounded-2xl flex items-center justify-center text-grey-dark mb-6 group-hover:bg-orange group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-grey-dark mb-4">{feature.title}</h3>
              <p className="text-grey-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyEdizo;
