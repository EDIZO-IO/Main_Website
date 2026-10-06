import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Code2, Smartphone, ShieldCheck, Rocket, Award, Layers } from 'lucide-react';

const faqs = [
  {
    q: "What digital services and software solutions does EDIZO specialize in?",
    a: "EDIZO specializes in full-lifecycle digital product development, including custom full-stack web development, responsive web applications, native and cross-platform mobile app development using Flutter, modern UI/UX design systems, SaaS product architecture, and enterprise AI automation. We engineer scalable, secure, and production-ready digital solutions tailored for startups, growth-stage brands, and established businesses.",
    icon: Code2
  },
  {
    q: "How does EDIZO approach custom web and mobile app development projects?",
    a: "We follow an agile, design-driven engineering process consisting of four structured phases: Discovery & Strategic Roadmapping, UI/UX Design & Interactive Prototyping, Production-Grade Full-Stack Development, and Automated Cloud Deployment. Every project undergoes rigorous code reviews, automated unit and integration testing, and performance optimization for optimal Core Web Vitals and search engine visibility.",
    icon: Rocket
  },
  {
    q: "Which modern technologies, frameworks, and programming languages do you use?",
    a: "Our core technology stack includes React.js, Next.js, Tailwind CSS, TypeScript, and Framer Motion for high-performance frontend interfaces; Node.js, Express, Python, and Go for backend APIs; PostgreSQL, MySQL, Redis, and MongoDB for secure data persistence; and Flutter for unified iOS and Android mobile development. We deploy on resilient cloud infrastructure such as AWS, Cloudflare, and Docker containers.",
    icon: Layers
  },
  {
    q: "What is the EDIZO technical internship and mentorship program?",
    a: "The EDIZO Internship Program is an immersive, hands-on training initiative designed for engineering students and aspiring developers. Participants work on live production codebases, build full-stack web applications and Flutter mobile apps, participate in sprint planning, receive 1-on-1 code mentorship from senior engineers, and gain verifiable experience delivering scalable software solutions.",
    icon: Award
  },
  {
    q: "How do you ensure data security, privacy compliance, and system reliability?",
    a: "Security and data integrity are embedded into every layer of our software architecture. We implement TLS encryption for all data in transit, strict database-level parameterization to prevent SQL injection, salted bcrypt password hashing, zero-trust role-based access control (RBAC), and automated rate-limiting to defend against DDoS and brute-force threats.",
    icon: ShieldCheck
  },
  {
    q: "How can we start a new digital project or partnership with EDIZO?",
    a: "Starting a project is simple. You can submit a project inquiry through our Contact page or click 'START A PROJECT'. Our solutions team will review your requirements, schedule a technical discovery consultation, and deliver a comprehensive project blueprint with defined milestones, architecture proposals, and delivery timelines.",
    icon: Smartphone
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className="py-14 sm:py-16 bg-grey-light/60 dark:bg-[#060B13] border-t border-navy/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 dark:bg-orange/15 border border-orange/20 text-[#B83200] dark:text-[#FF855C] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <HelpCircle size={14} /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-navy dark:text-white tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-base md:text-lg text-navy/80 dark:text-white/80 max-w-xl mx-auto font-medium">
            Explore detailed insights on our custom software engineering, web design workflows, and technology delivery standards.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const Icon = faq.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white dark:bg-[#0B132B] rounded-2xl md:rounded-3xl border border-navy/10 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left px-6 md:px-8 py-5 md:py-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-orange text-white' : 'bg-orange/10 dark:bg-orange/20 text-[#D93800] dark:text-[#FF855C]'}`}>
                      <Icon size={18} />
                    </div>
                    <span className="font-display font-bold text-base md:text-lg text-navy dark:text-white">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-navy/50 dark:text-white/50 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange dark:text-orange' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 md:px-8 pb-6 text-sm md:text-base text-navy/80 dark:text-white/80 leading-relaxed border-t border-navy/5 dark:border-white/5 pt-4 font-normal">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
