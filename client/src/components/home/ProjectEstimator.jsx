import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, CheckCircle2, ArrowRight, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SERVICE_TYPES = [
  { id: 'web', name: 'Web Application', basePrice: 800, baseWeeks: 3, icon: '🌐', desc: 'Custom React / Next.js web portals & platforms' },
  { id: 'mobile', name: 'Mobile App (iOS/Android)', basePrice: 1200, baseWeeks: 4, icon: '📱', desc: 'Native-feel Flutter apps with cross-platform build' },
  { id: 'backend', name: 'API & Microservices', basePrice: 600, baseWeeks: 2, icon: '⚡', desc: 'High-performance Node.js / MySQL REST & GraphQL APIs' },
  { id: 'design', name: 'UI/UX & Brand Design', basePrice: 400, baseWeeks: 2, icon: '🎨', desc: 'Figma prototypes, design systems & graphic identities' },
  { id: 'marketing', name: 'SEO & Growth Marketing', basePrice: 450, baseWeeks: 2, icon: '📈', desc: 'Search engine ranking, campaigns & analytics' },
];

const ADDONS = [
  { id: 'auth', name: 'Auth & Multi-role Access Control (RBAC)', price: 250, days: 3 },
  { id: 'payment', name: 'Payment Gateway (Razorpay / Stripe / UPI)', price: 350, days: 4 },
  { id: 'admin', name: 'Custom Admin Dashboard & Analytics', price: 450, days: 5 },
  { id: 'whatsapp', name: 'WhatsApp & Email Notification Bot', price: 300, days: 3 },
  { id: 'seo', name: 'Advanced On-Page SEO & Schema Markup', price: 200, days: 2 },
];

const PACES = [
  { id: 'standard', name: 'Standard Pace', multiplier: 1, timeMultiplier: 1, badge: 'Recommended' },
  { id: 'accelerated', name: 'Accelerated Sprint', multiplier: 1.2, timeMultiplier: 0.75, badge: '25% Faster' },
  { id: 'express', name: 'Express Rush', multiplier: 1.35, timeMultiplier: 0.5, badge: 'Priority Execution' },
];

const ProjectEstimator = () => {
  const [selectedService, setSelectedService] = useState(SERVICE_TYPES[0]);
  const [selectedAddons, setSelectedAddons] = useState(['auth', 'admin']);
  const [selectedPace, setSelectedPace] = useState(PACES[0]);
  const navigate = useNavigate();

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculateEstimate = () => {
    const addonsCost = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return acc + (addon ? addon.price : 0);
    }, 0);

    const rawCost = (selectedService.basePrice + addonsCost) * selectedPace.multiplier;
    const minCost = Math.round(rawCost * 0.95);
    const maxCost = Math.round(rawCost * 1.1);

    const addonsDays = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      return acc + (addon ? addon.days : 0);
    }, 0);

    const totalDays = Math.ceil((selectedService.baseWeeks * 7 + addonsDays) * selectedPace.timeMultiplier);
    const weeks = Math.ceil(totalDays / 7);

    return { minCost, maxCost, weeks, totalDays };
  };

  const { minCost, maxCost, weeks } = calculateEstimate();

  const handleStartProject = () => {
    const serviceName = selectedService.name;
    const addonsNames = selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name).filter(Boolean).join(', ');
    const note = `Estimated budget: $${minCost} - $${maxCost}. Timeline: ~${weeks} weeks. Addons: ${addonsNames}. Pace: ${selectedPace.name}`;
    navigate(`/contact?service=${encodeURIComponent(serviceName)}&note=${encodeURIComponent(note)}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-grey-light via-white to-grey-light relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-extrabold uppercase tracking-widest mb-4"
          >
            <Calculator size={14} />
            <span>Interactive Project Estimator</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-extrabold text-navy tracking-tight mb-4"
          >
            Calculate Your Scope & Budget Live
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-grey-medium text-lg"
          >
            Get an instant transparent estimate for your web, mobile, or API project in under 30 seconds.
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Configurator */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Select Service */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-grey-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">1</span>
                Select Core Solution Type
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      selectedService.id === service.id
                        ? 'border-orange bg-orange/5 shadow-sm'
                        : 'border-navy/10 hover:border-navy/30 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="font-display font-bold text-navy text-base">{service.name}</div>
                    <div className="text-xs text-grey-medium mt-1">{service.desc}</div>
                    {selectedService.id === service.id && (
                      <CheckCircle2 size={18} className="text-orange absolute top-3 right-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Add-ons */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-grey-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">2</span>
                Optional Feature Add-ons
              </h3>
              <div className="space-y-3">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked ? 'border-orange bg-orange/5' : 'border-navy/10 hover:border-navy/20 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 accent-orange cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-navy">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-orange">+${addon.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Select Pace */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/5 shadow-sm">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-grey-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange text-white text-xs flex items-center justify-center font-bold">3</span>
                Select Delivery Speed
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {PACES.map((pace) => (
                  <button
                    key={pace.id}
                    onClick={() => setSelectedPace(pace)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      selectedPace.id === pace.id
                        ? 'border-orange bg-orange/5 shadow-sm'
                        : 'border-navy/10 hover:border-navy/20 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-navy">{pace.name}</div>
                    <div className="text-[11px] font-semibold text-orange mt-1">{pace.badge}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Estimate Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-navy text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl -z-0" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-orange text-xs font-extrabold uppercase tracking-widest mb-6">
                  <Sparkles size={16} />
                  <span>Real-Time Estimation</span>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Estimated Investment Range</div>
                  <div className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
                    ${minCost.toLocaleString()} - ${maxCost.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60 mt-2">Includes architecture, QA testing, deployment & 30-day warranty.</div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mb-8">
                  <div>
                    <div className="text-xs text-white/60 flex items-center gap-1 mb-1">
                      <Clock size={14} className="text-orange" /> Estimated Time
                    </div>
                    <div className="text-xl font-bold text-white">{weeks} {weeks === 1 ? 'Week' : 'Weeks'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 flex items-center gap-1 mb-1">
                      <ShieldCheck size={14} className="text-orange" /> Support
                    </div>
                    <div className="text-xl font-bold text-white">30 Days Included</div>
                  </div>
                </div>

                <button
                  onClick={handleStartProject}
                  className="w-full py-4 bg-orange text-white font-extrabold text-base rounded-2xl hover:bg-orange-dark transition-all shadow-[0_8px_25px_rgba(255,90,31,0.4)] flex items-center justify-center gap-2 group"
                >
                  <span>Book Free Consultation</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-white/40 text-center mt-4">
                  No obligation • Custom NDAs signed upon request
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProjectEstimator;
