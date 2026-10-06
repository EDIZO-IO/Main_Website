---
name: software-company-ui-engineering
description: >-
  Expert guide for analyzing software company websites and engineering world-class,
  modern SaaS UI/UX designs in React.js with Tailwind CSS, Framer Motion, and real database integrations.
  Use when designing, evaluating, refactoring, or building tech agency, software company,
  or SaaS digital experiences.
---

# Software Company Website Analysis & Modern UI Engineering (React.js)

This skill provides comprehensive methodologies and engineering standards for auditing software company websites and building state-of-the-art digital experiences in React.js.

---

## 1. Software Company Website Analysis Framework

When analyzing or auditing a software company or digital agency website, execute a systematic 5-pillar audit:

### Pillar 1: Information Architecture & Brand Positioning
- **Hero Hook**: Is the value proposition immediately clear above the fold within 3 seconds? Does it combine a strong headline, clear subtitle, dual CTAs (Commercial + Secondary), and live credibility metrics?
- **Service Taxonomy**: Are services organized into clear, digestible categories (e.g., Web, Mobile, Cloud, AI, Design) rather than a wall of generic text?
- **Interactive Estimator / Product Configurator**: Is there a frictionless mechanism for prospective clients to calculate timelines and investment estimates?
- **Execution Pipeline**: Does the website articulate a clear, transparent delivery methodology (Discovery → Prototyping → Agile Build → QA/Deploy → Support)?
- **Academy / Talent Funnel**: If offering training or internships, is the curriculum structured with clear milestones, verified certifications, and career paths?
- **Conversion & Compliance**: Are contact forms intuitive, prefillable from URL parameters, and compliant with privacy standards (DPDP / GDPR)?

### Pillar 2: Data Integrity & Real-Time Binding
- **Zero Mock / Hardcoded Data**: All services, portfolio case studies, leadership profiles, testimonials, and site metadata must bind to live database tables via secure backend APIs.
- **Graceful Fallbacks & Skeletons**: Use animated shimmer skeleton loaders during API fetch states to prevent layout shifts (CLS = 0).
- **Error Boundaries & Sanitization**: Ensure API responses are validated and formatted safely (e.g. parsing JSON columns gracefully).

### Pillar 3: Visual Aesthetics & Design System
- **Curated Palette**: Avoid default raw colors. Enforce deep sophisticated bases (`#0B132B` Deep Navy, `#060B14` Dark, `#FFFFFF` Crisp White) paired with vibrant brand accents (`#FF5A1F` Edizo Vibrant Orange, `#FF855C` Soft Coral, `#38BDF8` Tech Sky).
- **Modern Typography**: High-contrast display fonts (`Outfit`, `Plus Jakarta Sans`) for headings and crisp geometric sans (`Inter`, `Plus Jakarta Sans`) for readable body copy.
- **Glassmorphism & Ambient Glows**: Use subtle background blurs (`backdrop-blur-xl`), hairline borders (`border-white/10` or `border-navy/10`), and multi-layer radial gradient mesh emitters.
- **Bento Grid Architecture**: Leverage asymmetrical multi-span cards with rounded corners (`rounded-[2.5rem]`) and contextual micro-badges.

### Pillar 4: Micro-Interactions & Fluid Motion
- **Spring-Physics Transitions**: Use Framer Motion with tailored spring configurations (`stiffness: 380, damping: 30`) for layout transitions and hover micro-physics.
- **Active Navigation Indicator**: Floating island navbar with animated pill layout transitions (`motion.div layoutId="nav-active-pill"`).
- **Animated Metric Counters**: Spring-interpolated counters triggered on scroll entry (`useInView`).
- **Minimalist Loading Splash**: Clean, distraction-free loading screen with subtle logo breathing animation and graceful opacity exit.

### Pillar 5: Cross-Device Responsiveness & Accessibility
- **Mobile-First Breakpoint Discipline**: Test and validate fluid layouts across 320px (Mobile S), 375–430px (Mobile L), 768px (Tablet), 1024px (Laptop), and 1536px+ (Ultra-wide).
- **Tap Targets**: Ensure all buttons and touch elements maintain a minimum hit area of 44×44px.
- **Color Contrast**: Verify all text and interactive indicators achieve WCAG AA contrast ratio (≥ 4.5:1).

---

## 2. React.js Component Architecture & Implementation Runbook

### Modern Design System Tokens (`index.css`)
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
@import "tailwindcss";

@theme {
  --color-orange: var(--theme-orange);
  --color-orange-dark: var(--theme-orange-dark);
  --color-navy: var(--theme-navy);
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', sans-serif;
}

:root {
  --theme-orange: #FF5A1F;
  --theme-orange-dark: #E04812;
  --theme-navy: #0B132B;
  --theme-grey-light: #F8FAFC;
}

.dark {
  --theme-orange: #FF6A38;
  --theme-navy: #F8FAFC;
  --theme-grey-light: #060B14;
}
```

### Dynamic Bento Card Template with Live Data
```jsx
import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ServiceBentoCard = ({ service, isFeatured }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/services/${service.id}`)}
      className={`group rounded-[2.5rem] p-8 cursor-pointer border transition-all duration-400 flex flex-col justify-between ${
        isFeatured 
          ? 'lg:col-span-2 bg-navy text-white border-navy-light shadow-xl' 
          : 'bg-white dark:bg-navy-light border-navy/10 dark:border-white/10 text-navy dark:text-white shadow-sm hover:border-orange/40 hover:shadow-2xl'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-orange/10 text-orange border border-orange/20">
            {service.category}
          </span>
          <div className="w-10 h-10 rounded-full bg-grey-light dark:bg-navy flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors">
            <ArrowUpRight size={18} />
          </div>
        </div>
        <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-orange transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-grey-medium dark:text-grey-silver leading-relaxed line-clamp-3">
          {service.description}
        </p>
      </div>
      <div className="pt-6 border-t border-navy/10 dark:border-white/10 flex items-center justify-between text-xs font-bold text-orange">
        <span>Explore Specifications</span>
        <span className="text-grey-medium">Production Architecture</span>
      </div>
    </motion.div>
  );
};
```

---

## 3. Review Checklist for New Pages

1. **Brand Identity**: Does the page feel uniquely tailored to the tech company with consistent logo, tokens, and ambient lighting?
2. **Data Live Connection**: Does the component fetch from real backend routes without static array mocks?
3. **Dark / Light Harmony**: Does text maintain high readability when toggling between themes?
4. **Interactive Responsiveness**: Are all interactive elements responsive on mobile touches and desktop pointers alike?
5. **Fast Load & Performance**: Are images optimized and responsive? Does the page load in under 2 seconds?
