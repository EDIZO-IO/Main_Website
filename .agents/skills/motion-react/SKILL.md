---
name: motion-react
description: Comprehensive expert guide, architecture, and production code patterns for Motion for React (formerly Framer Motion) from motion.dev/docs/react. Use when implementing, upgrading, debugging, or reviewing React animations, gestures, scroll-linked effects, layoutId morphs, AnimatePresence, variants, SVG path draws, useAnimate timelines, and performance optimizations.
---

# Motion for React (`motion/react`) Engineering Skill

This skill provides production-grade architectural guidance, API references, performance patterns, and copy-paste recipes for **Motion for React** (published as `motion/react` and `framer-motion` from [motion.dev/docs/react](https://motion.dev/docs/react)).

---

## 1. Package Installation & Import Conventions

### Modern (Motion v11/v12)
```bash
npm install motion
```
```tsx
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimate, 
  stagger, 
  LazyMotion, 
  domAnimation, 
  m, 
  Reorder, 
  useReducedMotion 
} from "motion/react";
```

### Legacy Framer Motion Compatibility
```bash
npm install framer-motion
```
```tsx
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useAnimate } from "framer-motion";
```

---

## 2. Core Animation Paradigms

### A. Basic Entry & State Transitions
```tsx
import { motion } from "motion/react";

export const FadeInCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] // Custom cubic-bezier for snappy feel
    }}
  >
    <h3>Accessible & Smooth</h3>
  </motion.div>
);
```

### B. Spring Physics vs. Easing Tweens
- **Spring Physics** (for natural physics on `x`, `y`, `scale`, `rotate`):
  ```tsx
  transition={{ 
    type: "spring", 
    stiffness: 300, 
    damping: 24, 
    mass: 0.8, 
    bounce: 0.25 
  }}
  ```
- **Tween Transitions** (for linear / eased transitions on `opacity`, `filter`, `backgroundColor`):
  ```tsx
  transition={{ 
    type: "tween", 
    duration: 0.35, 
    ease: "easeInOut" 
  }}
  ```
- **Inertia** (for momentum and deceleration after flick/release):
  ```tsx
  transition={{
    type: "inertia",
    velocity: 50,
    power: 0.8,
    timeConstant: 350,
    bounceStiffness: 300,
    bounceDamping: 20
  }}
  ```

### C. Keyframe Sequences & Repeating Loops
```tsx
<motion.div
  animate={{
    x: [0, 100, -100, 0],
    scale: [1, 1.2, 0.9, 1],
    rotate: [0, 90, 180, 0]
  }}
  transition={{
    duration: 6,
    times: [0, 0.2, 0.8, 1], // Timing checkpoint distribution
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "mirror" // "loop" | "reverse" | "mirror"
  }}
/>
```

### D. Per-Property Transitions
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8, y: 50 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  transition={{
    opacity: { duration: 0.2, ease: "linear" },
    scale: { type: "spring", stiffness: 400, damping: 25 },
    y: { type: "spring", stiffness: 300, damping: 20 }
  }}
/>
```

---

## 3. Custom Component Animation (`motion.create()`)

Animate custom third-party components or standard React functional components:

```tsx
import { motion } from "motion/react";
import { forwardRef } from "react";

// Standard forwardRef component
const CustomButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => <button ref={ref} {...props} />
);

// Wrap with motion.create()
const MotionButton = motion.create(CustomButton);

export const App = () => (
  <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    Click Me
  </MotionButton>
);
```

---

## 4. Gestures & Micro-Interactions

Cross-device interaction states with built-in touch fallbacks:

```tsx
<motion.button
  whileHover={{ scale: 1.04, y: -2 }}
  whileTap={{ scale: 0.96, y: 0 }}
  whileFocus={{ 
    boxShadow: "0 0 0 3px rgba(255, 90, 31, 0.4)", 
    scale: 1.02 
  }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="btn-primary"
>
  Get Started
</motion.button>
```

### Drag Gestures & Constraints
```tsx
import { motion } from "motion/react";
import { useRef } from "react";

export const DraggableCard = () => {
  const constraintsRef = useRef(null);

  return (
    <div ref={constraintsRef} className="container h-96 w-full relative overflow-hidden">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.15}
        dragMomentum={true}
        dragSnapToOrigin={false}
        whileDrag={{ scale: 1.08, cursor: "grabbing", zIndex: 50 }}
        className="card"
      />
    </div>
  );
};
```

---

## 5. Scroll-Linked & Viewport Animations

### A. Viewport-Triggered Entry (`whileInView`)
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ 
    once: true,      // Animate only once when entering viewport
    margin: "-80px", // Trigger 80px before entering
    amount: 0.3      // Trigger when 30% visible
  }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h2>Appears on Scroll</h2>
</motion.div>
```

### B. Scroll-Linked Progress & Parallax Transforms (`useScroll`, `useTransform`)
```tsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export const ParallaxHero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"] // ["when top enters viewport bottom", "when bottom leaves viewport top"]
  });

  // Smooth scroll progression with spring physics
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Map progress [0, 1] to translation, scale, opacity
  const y = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <div ref={targetRef} className="relative h-[150vh] overflow-hidden">
      <motion.div style={{ y, opacity, scale }} className="sticky top-20">
        <h1>Parallax Hero Heading</h1>
      </motion.div>
    </div>
  );
};
```

---

## 6. Exit Animations with `<AnimatePresence>`

Enables animating elements when unmounted from the React DOM tree.

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const ModalDialog = ({ isOpen, onClose }) => (
  <AnimatePresence mode="wait">
    {isOpen && (
      <div className="modal-backdrop">
        <motion.div
          key="modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="modal-content"
        >
          <h2>Interactive Dialog</h2>
          <button onClick={onClose}>Close</button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
```

### Direction-Aware Slider / Carousel
```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export const SlideCarousel = ({ items }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const paginate = (newDirection: number) => setPage([page + newDirection, newDirection]);

  return (
    <div className="relative overflow-hidden h-64">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          className="absolute inset-0"
        >
          {items[Math.abs(page % items.length)]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

---

## 7. Layout Animations & Shared `layoutId` Morphs

### A. Automatic Layout Adjustments (`layout`)
Adding `layout` to any component automatically animates changes in size, padding, or flex order without jerky DOM shifts.

```tsx
<motion.div layout className={`card ${isExpanded ? 'expanded' : 'collapsed'}`}>
  <motion.h3 layout="position">Expandable Accordion</motion.h3>
  {isExpanded && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Full details...</motion.p>}
</motion.div>
```

### B. Shared Tab Pill Indicator (`layoutId`)
Morphs a highlight background between active tab items seamlessly:

```tsx
import { useState } from "react";
import { motion } from "motion/react";

const TABS = ["Discover", "Design", "Build", "Launch", "Scale"];

export const TabBar = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-full">
      {TABS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-5 py-2 rounded-full text-sm font-bold text-slate-900"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-orange-500 rounded-full shadow-md z-0"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-700'}`}>
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  );
};
```

---

## 8. Variants & Stagger Orchestration

Variants decouple animation definitions from components and automatically coordinate parent-child hierarchies:

```tsx
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  }
};

export const StaggeredGrid = ({ items }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    className="grid grid-cols-1 md:grid-cols-3 gap-6"
  >
    {items.map((item, idx) => (
      <motion.div key={idx} variants={itemVariants} className="card">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </motion.div>
    ))}
  </motion.div>
);
```

---

## 9. Imperative Timelines with `useAnimate()`

For manual orchestrations, multi-step sequences, and complex triggers:

```tsx
import { useAnimate, stagger } from "motion/react";

export const SequenceController = () => {
  const [scope, animate] = useAnimate();

  const handleTrigger = async () => {
    // Step 1: Scale button
    await animate("button", { scale: 0.95 }, { duration: 0.1 });
    await animate("button", { scale: 1 }, { duration: 0.15 });

    // Step 2: Animate status badge
    await animate(".badge", { opacity: [0, 1], y: [-10, 0] }, { duration: 0.25 });

    // Step 3: Stagger list items in
    await animate(".list-item", { opacity: 1, x: 0 }, { delay: stagger(0.05) });
  };

  return (
    <div ref={scope}>
      <button onClick={handleTrigger}>Trigger Sequence</button>
      <div className="badge opacity-0">Processing...</div>
      <ul>
        <li className="list-item opacity-0 -translate-x-4">Item 1</li>
        <li className="list-item opacity-0 -translate-x-4">Item 2</li>
        <li className="list-item opacity-0 -translate-x-4">Item 3</li>
      </ul>
    </div>
  );
};
```

---

## 10. Motion Values & Dynamic Style Templates

```tsx
import { motion, useMotionValue, useTransform, useMotionTemplate } from "motion/react";

export const MouseFollowGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,90,31,0.15), transparent 80%)`;

  return (
    <div onMouseMove={handleMouseMove} className="relative p-8 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
      <motion.div style={{ background }} className="pointer-events-none absolute inset-0" />
      <h3 className="relative z-10 text-white">Interactive Dynamic Glow</h3>
    </div>
  );
};
```

---

## 11. SVG Path & Icon Drawing

```tsx
import { motion } from "motion/react";

export const AnimatedCheckmark = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <motion.circle
      cx="24"
      cy="24"
      r="20"
      stroke="#FF5A1F"
      strokeWidth="4"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    />
    <motion.path
      d="M14 24 L21 31 L34 18"
      stroke="#FF5A1F"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="transparent"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
    />
  </svg>
);
```

---

## 12. Drag-to-Reorder Lists (`<Reorder />`)

```tsx
import { useState } from "react";
import { Reorder } from "motion/react";

export const SortableList = () => {
  const [items, setItems] = useState(["Web Dev", "App Dev", "UI/UX Design", "SEO"]);

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
      {items.map((item) => (
        <Reorder.Item 
          key={item} 
          value={item}
          whileDrag={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
          className="p-4 bg-white rounded-xl shadow cursor-grab active:cursor-grabbing"
        >
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
```

---

## 13. Performance, Bundle Optimization & Accessibility

### A. Reducing Bundle Size with `<LazyMotion />`
Replace full bundle imports with `m` components and dynamically loaded features:

```tsx
import { LazyMotion, domAnimation, m } from "motion/react";

export const OptimizedApp = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    {/* Use <m.div> instead of <motion.div> */}
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </m.div>
  </LazyMotion>
);
```

### B. Accessibility & Reduced Motion (`useReducedMotion`)
Always respect system-level animation reduction preferences:

```tsx
import { motion, useReducedMotion } from "motion/react";

export const AccessibleCard = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.5 }}
    >
      <h3>Accessible Motion</h3>
    </motion.div>
  );
};
```

### C. Hardware Acceleration Best Practices
- **Animate only composite properties**: Stick to `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`. Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding` directly when high frame rate is required.
- **Set GPU Layer Hints**: For intensive animations, apply `style={{ willChange: "transform, opacity" }}` or `className="transform-gpu"`.
