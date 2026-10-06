import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, Palette, Code2, Rocket, RefreshCw, 
  ArrowRight, Sparkles, Terminal, ShieldCheck, 
  Gauge, Globe, Cpu, Database, Check, GitCommit,
  GitBranch, Server, Smartphone, Laptop, Star,
  Activity, Layers, ArrowUpRight, CheckCircle2,
  Workflow, Zap
} from 'lucide-react';

const PROCESS_STEPS = [
  {
    id: '01',
    stepNumber: 1,
    name: 'Discovery',
    phase: 'PHASE 01',
    title: 'Requirements & Technical Blueprint',
    tagline: 'We analyze your business objectives, map system workflows, and architect a robust technical foundation before writing code.',
    icon: Search,
    color: '#FF5A1F',
    kpi: {
      value: '100%',
      label: 'Requirement Clarity',
      badge: 'Zero Technical Debt'
    },
    deliverables: [
      { title: 'Scope Definition', subtitle: 'Feature PRD & Milestones', icon: Workflow },
      { title: 'System Architecture', subtitle: 'Database & API Blueprint', icon: Database },
      { title: 'Stack Selection', subtitle: 'Modern High-Scale Tools', icon: Cpu },
      { title: 'Security Audit', subtitle: 'Threat & Auth Modeling', icon: ShieldCheck }
    ],
    visualType: 'discovery'
  },
  {
    id: '02',
    stepNumber: 2,
    name: 'Design',
    phase: 'PHASE 02',
    title: 'Design Systems & Interactive UX',
    tagline: 'Crafting responsive, high-density interfaces engineered with scalable Figma tokens, micro-interactions, and WCAG 2.2 AA standards.',
    icon: Palette,
    color: '#A855F7',
    kpi: {
      value: '250+',
      label: 'Design Tokens',
      badge: 'WCAG 2.2 AA Compliant'
    },
    deliverables: [
      { title: 'Wireframes & Flows', subtitle: 'Frictionless Journeys', icon: Layers },
      { title: 'Design System', subtitle: 'Modular Component Tokens', icon: Palette },
      { title: 'Responsive Prototypes', subtitle: 'Mobile + Desktop Ready', icon: Smartphone },
      { title: 'Accessibility Specs', subtitle: 'Color Contrast & ARIA', icon: CheckCircle2 }
    ],
    visualType: 'design'
  },
  {
    id: '03',
    stepNumber: 3,
    name: 'Build',
    phase: 'PHASE 03',
    title: 'Full-Stack Architecture & Clean Code',
    tagline: 'Engineering blazing-fast, secure web applications and mobile apps using React, Node.js, and relational database best practices.',
    icon: Code2,
    color: '#3B82F6',
    kpi: {
      value: '< 15ms',
      label: 'Query Latency',
      badge: 'Strict Type-Safety'
    },
    deliverables: [
      { title: 'Frontend Engine', subtitle: 'React 18 & Vite Architecture', icon: Laptop },
      { title: 'API Endpoints', subtitle: 'REST & Parameterized Queries', icon: Server },
      { title: 'Security Shield', subtitle: 'JWT + RBAC Access Control', icon: ShieldCheck },
      { title: 'Automated Tests', subtitle: 'Unit & Integration Suites', icon: Check }
    ],
    visualType: 'build'
  },
  {
    id: '04',
    stepNumber: 4,
    name: 'Launch',
    phase: 'PHASE 04',
    title: 'Automated CI/CD & Edge Deployment',
    tagline: 'Multi-device validation, global Cloudflare CDN asset distribution, SSL security hardening, and zero-downtime releases.',
    icon: Rocket,
    color: '#10B981',
    kpi: {
      value: '99/100',
      label: 'Performance Score',
      badge: 'Zero-Downtime Pipeline'
    },
    deliverables: [
      { title: 'Multi-Device QA', subtitle: 'Cross-Engine Verification', icon: Smartphone },
      { title: 'Edge CDN Caching', subtitle: 'Global Cloudflare Network', icon: Globe },
      { title: 'SSL & Rate Limiting', subtitle: 'Enterprise Edge Shield', icon: ShieldCheck },
      { title: 'Speed Optimization', subtitle: 'Core Web Vitals 95+', icon: Gauge }
    ],
    visualType: 'launch'
  },
  {
    id: '05',
    stepNumber: 5,
    name: 'Scale',
    phase: 'PHASE 05',
    title: 'Admin Ownership & Continuous Scaling',
    tagline: 'Full administrative sovereignty through customized admin dashboards, live database control, and proactive iteration.',
    icon: RefreshCw,
    color: '#F59E0B',
    kpi: {
      value: '99.99%',
      label: 'Service Availability',
      badge: '100% Dynamic CMS'
    },
    deliverables: [
      { title: 'Custom Admin Panel', subtitle: 'Real-Time Content Control', icon: Laptop },
      { title: 'Database Indexing', subtitle: 'High-Volume Query Tuning', icon: Database },
      { title: 'Telemetry & Logs', subtitle: 'Audit Trails & Alerts', icon: Activity },
      { title: 'SLA Support', subtitle: 'Continuous Sprints & Tuning', icon: Zap }
    ],
    visualType: 'scale'
  }
];

const Process = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeStep = PROCESS_STEPS[activeIdx];

  // Auto-play cycle every 5.5s (pauses smoothly on hover/interaction)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const progressPercent = ((activeIdx + 1) / PROCESS_STEPS.length) * 100;

  return (
    <section 
      className="py-16 md:py-18 bg-[#050B14] text-white relative overflow-hidden font-sans select-none"
      id="how-we-work"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#FF855C] font-bold text-xs uppercase tracking-widest mb-3">
            <Sparkles size={14} className="text-[#FF855C]" aria-hidden="true" />
            Engineering Lifecycle
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.1] tracking-tight mb-4">
            How We Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F]">
              World-Class Products.
            </span>
          </h2>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            A battle-tested 5-stage engineering method designed for speed, security, and effortless admin scalability.
          </p>
        </div>

        {/* 1. Interactive Timeline Navigation Bar */}
        <div className="relative max-w-4xl mx-auto mb-16 px-4">
          {/* Connecting Line Track */}
          <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
          
          {/* Active Fill Line */}
          <motion.div 
            className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] z-0"
            initial={false}
            animate={{ 
              width: `${(activeIdx / (PROCESS_STEPS.length - 1)) * 90}%` 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {/* Timeline Nodes */}
          <div className="relative z-10 flex justify-between items-center">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = idx === activeIdx;
              const isPast = idx < activeIdx;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className="group flex flex-col items-center focus:outline-none"
                  aria-label={`Go to step ${step.id}: ${step.name}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {/* Node Circle */}
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-display font-black text-xs transition-all duration-300 relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] text-white shadow-lg shadow-orange/40 scale-110 ring-4 ring-orange/20'
                      : isPast
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-[#091020] text-white/50 border border-white/10 hover:border-white/30 hover:text-white'
                  }`}>
                    {isPast ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Step Label */}
                  <span className={`text-[11px] sm:text-xs font-bold mt-2.5 transition-colors tracking-wide ${
                    isActive ? 'text-white font-extrabold' : 'text-white/50 group-hover:text-white/80'
                  }`}>
                    {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Main Split-Screen Container (40% Left / 60% Right) */}
        <div className="bg-[#091226]/80 border border-white/10 rounded-[2.5rem] p-6 sm:p-10 md:p-12 relative overflow-hidden backdrop-blur-xl shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* LEFT COLUMN (42%): Phase Info & Visual Deliverable Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Phase & Step Pill */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FF3B30]/20 to-[#FF5A1F]/20 border border-orange/40 text-[#FF855C] font-mono text-xs font-bold">
                      {activeStep.phase}
                    </span>
                    <span className="text-xs text-white/50 font-medium">
                      Step {activeStep.stepNumber} of {PROCESS_STEPS.length}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-white leading-tight mb-3">
                    {activeStep.title}
                  </h3>
                  <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {activeStep.tagline}
                  </p>

                  {/* 4 Visual Deliverable Mini Cards (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {activeStep.deliverables.map((d, i) => {
                      const IconComponent = d.icon;
                      return (
                        <div 
                          key={i} 
                          className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-3.5 transition-all flex flex-col justify-between group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-orange group-hover:bg-orange group-hover:text-white transition-colors mb-2.5">
                            <IconComponent size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight mb-0.5">{d.title}</p>
                            <p className="text-[11px] text-white/70 leading-tight">{d.subtitle}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Key Stage KPI Chip */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-8">
                    <div>
                      <span className="text-[10px] text-white/70 uppercase tracking-wider font-bold block mb-0.5">
                        Target Benchmark
                      </span>
                      <span className="text-xs text-white/90 font-medium">
                        {activeStep.kpi.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-light block">
                        {activeStep.kpi.value}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        {activeStep.kpi.badge}
                      </span>
                    </div>
                  </div>

                  {/* Conversion Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to="/contact"
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] hover:from-[#E02E24] hover:to-[#E04812] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange/30 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                    >
                      Book Free Consultation <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    <Link
                      to="/projects"
                      className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                    >
                      View Case Studies
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN (58%): Large Animated Visualization */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full"
                >

                  {/* VISUAL 1: DISCOVERY - Interactive Architecture Flow */}
                  {activeStep.visualType === 'discovery' && (
                    <div className="bg-[#0D152A] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-2">
                          <Workflow size={16} className="text-orange" />
                          <span className="text-xs font-mono text-white/90 font-bold">Architecture Workflow Mapping</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-orange/20 text-[#FF855C] text-[10px] font-bold font-mono">SPRINT SPEC READY</span>
                      </div>

                      {/* Architecture Step Flow Cards */}
                      <div className="grid grid-cols-2 gap-3.5 relative z-10">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative">
                          <span className="text-[10px] text-orange font-bold uppercase font-mono mb-1 block">01. Intake</span>
                          <h4 className="text-sm font-bold text-white mb-1">Business PRD & Scope</h4>
                          <p className="text-[11px] text-white/60">Functional milestones & compliance requirements</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative">
                          <span className="text-[10px] text-blue-400 font-bold uppercase font-mono mb-1 block">02. Tech Stack</span>
                          <h4 className="text-sm font-bold text-white mb-1">Stack Blueprint</h4>
                          <p className="text-[11px] text-white/60">React 18 + Node.js + MySQL + Cloudflare CDN</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative">
                          <span className="text-[10px] text-purple-400 font-bold uppercase font-mono mb-1 block">03. Database</span>
                          <h4 className="text-sm font-bold text-white mb-1">Relational Schema</h4>
                          <p className="text-[11px] text-white/60">3NF Normalization, Indexes, Foreign Keys & RBAC</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative">
                          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono mb-1 block">04. Roadmap</span>
                          <h4 className="text-sm font-bold text-white mb-1">Sprint Execution</h4>
                          <p className="text-[11px] text-white/60">Bi-weekly deliverables & client review checkpoints</p>
                        </div>
                      </div>

                      {/* Bottom Flow Footer */}
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-emerald-300 font-medium">✓ System architecture validated & risk-free</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-bold">100% Alignment</span>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 2: DESIGN - Dual Device Figma Canvas */}
                  {activeStep.visualType === 'design' && (
                    <div className="bg-[#0D152A] border border-white/15 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                        <div className="flex items-center gap-2">
                          <Palette size={16} className="text-purple-400" />
                          <span className="text-xs font-mono text-white/90 font-bold">Figma Token Canvas & UI Wireframes</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold font-mono">WCAG 2.2 AA PASS</span>
                      </div>

                      {/* Multi-Device Canvas Mockup */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Desktop Wireframe (7 cols) */}
                        <div className="sm:col-span-7 bg-[#070D1E] border border-white/10 rounded-2xl p-3 shadow-inner">
                          <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-white/5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            <span className="text-[10px] font-mono text-white/40 ml-1">Desktop Portal</span>
                          </div>
                          <div className="h-4 w-1/3 bg-orange/40 rounded mb-2" />
                          <div className="h-2 w-3/4 bg-white/20 rounded mb-3" />
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
                            <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
                            <div className="h-14 bg-white/5 border border-white/10 rounded-xl" />
                          </div>
                          <div className="h-10 bg-gradient-to-r from-orange/20 to-purple-500/20 rounded-xl border border-white/5" />
                        </div>

                        {/* Mobile Wireframe (5 cols) */}
                        <div className="sm:col-span-5 bg-[#070D1E] border border-white/10 rounded-2xl p-3 shadow-inner">
                          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-2" />
                          <div className="h-3 w-1/2 bg-purple-400/50 rounded mb-2" />
                          <div className="space-y-1.5 mb-2">
                            <div className="h-6 bg-white/5 rounded-lg border border-white/10" />
                            <div className="h-6 bg-white/5 rounded-lg border border-white/10" />
                            <div className="h-6 bg-white/5 rounded-lg border border-white/10" />
                          </div>
                          <div className="h-7 bg-orange text-white rounded-lg flex items-center justify-center text-[10px] font-bold">
                            Touch Target 48px
                          </div>
                        </div>
                      </div>

                      {/* Design Tokens Bar */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center text-xs">
                        <div className="p-2 bg-white/5 rounded-xl">
                          <span className="text-[10px] text-white/50 block">Theme Primary</span>
                          <span className="font-mono text-[11px] font-bold text-orange">#FF5A1F</span>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl">
                          <span className="text-[10px] text-white/50 block">Typography</span>
                          <span className="font-mono text-[11px] font-bold text-white">Outfit + Inter</span>
                        </div>
                        <div className="p-2 bg-white/5 rounded-xl">
                          <span className="text-[10px] text-white/50 block">Contrast Ratio</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-400">4.52:1 AA</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 3: BUILD - Git Commits & Full-Stack Engine */}
                  {activeStep.visualType === 'build' && (
                    <div className="bg-[#070D1E] border border-white/15 rounded-3xl p-6 shadow-2xl font-mono text-xs">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-xs">
                        <div className="flex items-center gap-2">
                          <GitBranch size={16} className="text-blue-400" />
                          <span className="text-white font-bold">main • production-engine</span>
                        </div>
                        <span className="text-emerald-400 text-[11px]">✓ Typecheck & Build Pass</span>
                      </div>

                      {/* Git Commit Stream */}
                      <div className="space-y-2 mb-4 text-[11px]">
                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GitCommit size={14} className="text-blue-400" />
                            <span className="text-white/90">feat: implement auth middleware & rate limiters</span>
                          </div>
                          <span className="text-white/40 text-[10px]">hash 8f3a9d</span>
                        </div>
                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GitCommit size={14} className="text-emerald-400" />
                            <span className="text-white/90">perf: index relational foreign keys in MySQL</span>
                          </div>
                          <span className="text-white/40 text-[10px]">hash 2c14e7</span>
                        </div>
                      </div>

                      {/* Live Code API Snippet */}
                      <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 text-[11px] text-white/80 leading-relaxed space-y-1">
                        <p><span className="text-purple-400">export async function</span> <span className="text-blue-400">getServices</span>() &#123;</p>
                        <p className="pl-4 text-white/50">// Parameterized query protection against SQL injection</p>
                        <p className="pl-4"><span className="text-purple-400">const</span> [rows] = <span className="text-purple-400">await</span> db.<span className="text-yellow-300">query</span>(</p>
                        <p className="pl-8 text-emerald-300">'SELECT * FROM services WHERE status = ?', ['active']</p>
                        <p className="pl-4">);</p>
                        <p className="pl-4"><span className="text-purple-400">return</span> rows;</p>
                        <p>&#125;</p>
                      </div>

                      <div className="mt-3.5 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between text-[11px]">
                        <span className="text-blue-300">✓ 100% Parameterized Queries • Zero Leaks</span>
                        <span className="text-blue-400 font-bold">Tested</span>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 4: LAUNCH - CI/CD Pipeline & CDN Edge */}
                  {activeStep.visualType === 'launch' && (
                    <div className="bg-[#0D152A] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-xs">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <Rocket size={16} className="text-emerald-400" />
                          <span>Production CI/CD Edge Deployment</span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded-full font-mono">AUTOMATED RELEASE</span>
                      </div>

                      {/* Pipeline Steps Grid */}
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1.5" />
                          <p className="font-bold text-white text-[11px]">Lint & Audit</p>
                          <span className="text-[10px] text-emerald-400 font-mono">Pass</span>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1.5" />
                          <p className="font-bold text-white text-[11px]">Unit Tests</p>
                          <span className="text-[10px] text-emerald-400 font-mono">Pass</span>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1.5" />
                          <p className="font-bold text-white text-[11px]">Vite Bundle</p>
                          <span className="text-[10px] text-emerald-400 font-mono">Minified</span>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 rounded-2xl">
                          <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1.5 animate-ping" />
                          <p className="font-bold text-white text-[11px]">Edge CDN</p>
                          <span className="text-[10px] text-emerald-300 font-mono">Live</span>
                        </div>
                      </div>

                      {/* Metrics Card */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                          <Gauge size={22} className="text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-base font-display font-black text-white leading-none">100 / 100</p>
                            <p className="text-[10px] text-white/50 font-medium">Core Web Vitals</p>
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                          <Globe size={22} className="text-blue-400 shrink-0" />
                          <div>
                            <p className="text-base font-display font-black text-white leading-none">&lt; 20ms</p>
                            <p className="text-[10px] text-white/50 font-medium">Cloudflare CDN Edge</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-xs text-white/80">
                        <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-emerald-400" /> SSL / TLS 1.3 Active & Strict Security Headers</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">Hardened</span>
                      </div>
                    </div>
                  )}

                  {/* VISUAL 5: SCALE - Real-Time Admin Telemetry Panel */}
                  {activeStep.visualType === 'scale' && (
                    <div className="bg-[#0D152A] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 text-xs">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <Activity size={16} className="text-amber-400" />
                          <span>Central Admin CMS & Telemetry</span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 font-bold text-[10px] rounded-full font-mono">LIVE CONTROL</span>
                      </div>

                      {/* Admin Management Status Bars */}
                      <div className="space-y-2.5">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <div>
                              <p className="text-xs font-bold text-white">Portfolio & Services CMS</p>
                              <p className="text-[10px] text-white/50">Admin publishing & dynamic database sync</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 font-mono">100% Dynamic</span>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                            <div>
                              <p className="text-xs font-bold text-white">Inquiries & CRM Pipeline</p>
                              <p className="text-[10px] text-white/50">Real-time leads & WhatsApp automated alerts</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-400 font-mono">Active</span>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div>
                              <p className="text-xs font-bold text-white">Invoices & Billing Ledger</p>
                              <p className="text-[10px] text-white/50">Automated PDF generator & GST compliance</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-300 font-mono">Synced</span>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs text-amber-300">
                        <span>24/7 SLA Guarantee & Ongoing Iterations</span>
                        <span className="font-mono font-bold">99.99% Uptime</span>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* 3. Bottom Progress Bar & Social Proof Indicators */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Progress Percentage Indicator */}
            <div className="w-full sm:w-1/3">
              <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                <span>STAGE {activeStep.id} OF 05</span>
                <span className="text-orange font-bold">{Math.round(progressPercent)}% COMPLETE</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#FF3B30] to-[#FF5A1F] rounded-full"
                  initial={false}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Social Proof Trust Badges */}
            <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-end text-xs font-medium text-white/70">
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <strong className="text-white font-bold">50+</strong> Projects Delivered
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400" />
                <strong className="text-white font-bold">99%</strong> Client Satisfaction
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-orange" />
                <strong className="text-white font-bold">24/7</strong> Direct Support
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Process;
