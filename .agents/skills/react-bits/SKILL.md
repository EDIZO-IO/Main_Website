---
name: react-bits
description: Comprehensive expert guide, architecture, and production code patterns for React Bits (reactbits.dev by David Haz). Use when implementing, customizing, or engineering high-performance animated UI components, interactive text animations (SplitText, BlurText, DecryptedText, TrueFocus, ShinyText, VariableProximity, FallingText, ScrollReveal, ASCIIText, LetterGlitch), creative backgrounds (Hyperspeed, Ballpit, Aurora, Squares, DotGrid, GridDistortion, Ribbons, Particles, Iridescence, Threads), cursor animations (Magnet, ClickSpark, SplashCursor, BlobCursor, StarBorder, Crosshair), and modern interactive cards/docks (SpotlightCard, Dock, TiltedCard, DecayCard, PixelTransition, Lanyard, InfiniteScroll, InfiniteMenu, RollingGallery, ElasticSlider, CountUp).
---

# React Bits (`reactbits.dev`) Engineering Skill

**React Bits** (by David Haz / `@DavidHDev` from [reactbits.dev](https://reactbits.dev)) is an open-source library of 170+ animated, interactive, and highly customizable React components built on **Motion (`motion/react` / `framer-motion`)**, **GSAP**, **Tailwind CSS**, and **WebGL / Three.js / OGL / Matter.js / Canvas**.

Unlike monolithic UI libraries, React Bits uses a copy-paste / CLI architecture (similar to `shadcn/ui`), giving full ownership and zero-bloat control over the component source code.

---

## 1. Quick Start, Dependencies & CLI Integration

### A. Core Peer Dependencies
Install the required animation and rendering engines depending on the components in use:

```bash
# Core animation & utility engines
npm install motion gsap clsx tailwind-merge

# For WebGL / 3D Canvas / Physics (Hyperspeed, Ballpit, Lanyard, GridDistortion, Iridescence)
npm install ogl three @types/three matter-js
```

### B. CLI Installation via `jsrepo` / `shadcn`
Add individual components directly into your codebase:

```bash
# Text animations
npx jsrepo add github/DavidHDev/react-bits/TextAnimations/SplitText
npx jsrepo add github/DavidHDev/react-bits/TextAnimations/ShinyText
npx jsrepo add github/DavidHDev/react-bits/TextAnimations/VariableProximity
npx jsrepo add github/DavidHDev/react-bits/TextAnimations/FallingText

# UI Components
npx jsrepo add github/DavidHDev/react-bits/Components/SpotlightCard
npx jsrepo add github/DavidHDev/react-bits/Components/Dock
npx jsrepo add github/DavidHDev/react-bits/Components/TiltedCard
npx jsrepo add github/DavidHDev/react-bits/Components/PixelTransition
npx jsrepo add github/DavidHDev/react-bits/Components/Lanyard

# Backgrounds
npx jsrepo add github/DavidHDev/react-bits/Backgrounds/Hyperspeed
npx jsrepo add github/DavidHDev/react-bits/Backgrounds/Ballpit
npx jsrepo add github/DavidHDev/react-bits/Backgrounds/Aurora
npx jsrepo add github/DavidHDev/react-bits/Backgrounds/Squares
npx jsrepo add github/DavidHDev/react-bits/Backgrounds/Ribbons

# Animations & Cursors
npx jsrepo add github/DavidHDev/react-bits/Animations/Magnet
npx jsrepo add github/DavidHDev/react-bits/Animations/ClickSpark
npx jsrepo add github/DavidHDev/react-bits/Animations/SplashCursor
npx jsrepo add github/DavidHDev/react-bits/Animations/StarBorder
```

### C. 4-Stack Variant Support
Every component in React Bits is designed to support:
1. **TS + Tailwind**: Modern TypeScript with utility classes (recommended).
2. **JS + Tailwind**: Standard JavaScript with utility classes.
3. **TS + CSS**: TypeScript with modular vanilla CSS.
4. **JS + CSS**: JavaScript with modular vanilla CSS.

---

## 2. Text Animations (`TextAnimations`)

### A. `SplitText` (Staggered Word / Character Reveal)
Splits sentences into animated tokens with customizable delays, easing, and springs:

```tsx
import { motion } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: { opacity: number; transform: string };
  animationTo?: { opacity: number; transform: string };
  easing?: string;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" }
}) => {
  const words = text.split(" ");

  return (
    <p className={`inline-block overflow-hidden ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={animationFrom}
              whileInView={animationTo}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: (wordIndex * word.length + charIndex) * (delay / 1000),
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </p>
  );
};
```

---

### B. `BlurText` (Progressive Gaussian Blur In/Out)
Renders text smoothly interpolating from `filter: blur(12px)` to crisp focus:

```tsx
import { motion } from "motion/react";

export const BlurText = ({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words", // 'words' | 'letters'
  direction = "top" // 'top' | 'bottom'
}: {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}) => {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  return (
    <p className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{
            filter: "blur(12px)",
            opacity: 0,
            y: direction === "top" ? -20 : 20
          }}
          whileInView={{
            filter: "blur(0px)",
            opacity: 1,
            y: 0
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: (index * delay) / 1000,
            ease: "easeOut"
          }}
          className="inline-block mr-1.5"
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </p>
  );
};
```

---

### C. `ShinyText` (Metallic Shimmer Across Typography)
Creates an animated light sweep reflection across typography:

```tsx
export const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = ""
}: {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${
        disabled ? "text-slate-400" : "animate-shine bg-gradient-to-r from-white via-white/80 to-white/20"
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? undefined
          : "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: `${speed}s`
      }}
    >
      {text}
    </span>
  );
};
```

---

### D. `DecryptedText` (Cyberpunk Character Scramble)
```tsx
import { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

export const DecryptedText = ({
  text,
  speed = 40,
  maxIterations = 15,
  trigger = "hover", // "hover" | "view"
  className = ""
}: {
  text: string;
  speed?: number;
  maxIterations?: number;
  trigger?: "hover" | "view";
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current!);
      }
      iteration += 1 / (maxIterations / text.length);
    }, speed);
  };

  useEffect(() => {
    if (trigger === "view") startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span
      onMouseEnter={() => trigger === "hover" && startScramble()}
      className={`font-mono inline-block cursor-default ${className}`}
    >
      {displayText}
    </span>
  );
};
```

---

### E. `VariableProximity` (Dynamic Variable Font Weight Scaling)
Dynamically alters font weight / width parameters based on mouse cursor distance:

```tsx
import { useRef, useEffect } from "react";

export const VariableProximity = ({
  label,
  fromFontVariationSettings = "'wght' 300, 'opsz' 9",
  toFontVariationSettings = "'wght' 900, 'opsz' 40",
  radius = 100,
  className = ""
}: {
  label: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  radius?: number;
  className?: string;
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const letters = containerRef.current.querySelectorAll("span");

      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - letterX, e.clientY - letterY);

        if (dist < radius) {
          const power = 1 - dist / radius;
          letter.style.fontVariationSettings = `'wght' ${Math.round(300 + power * 600)}`;
        } else {
          letter.style.fontVariationSettings = "'wght' 300";
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [radius]);

  return (
    <p ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {label.split("").map((char, i) => (
        <span key={i} className="inline-block transition-[font-variation-settings] duration-150">
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
};
```

---

### F. `ScrollReveal` & `ScrollFloat` (Progressive Viewport Text Unveiling)
Progressively animates word opacity and vertical float based on scroll coordinates:

```tsx
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const ScrollReveal = ({ text, className = "" }: { text: string; className?: string }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.9", "end 0.25"]
  });

  const words = text.split(" ");

  return (
    <div ref={targetRef} className={`flex flex-wrap gap-2 text-3xl font-bold leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        const y = useTransform(scrollYProgress, [start, end], [15, 0]);

        return (
          <motion.span key={i} style={{ opacity, y }} className="inline-block">
            {word}
          </motion.span>
        );
      })}
    </div>
  );
};
```

---

## 3. UI Components (`Components`)

### A. `SpotlightCard` (Mouse Tracking Radial Glow)
```tsx
import React, { useRef, useState } from "react";

export const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 90, 31, 0.15)"
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
```

---

### B. `PixelTransition` (Interactive Pixel-Dissolve Card)
Dissolves between two content cards using a retro canvas pixelation matrix:

```tsx
import { useState, useRef, useEffect } from "react";

export const PixelTransition = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = "#FF5A1F"
}: {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovered) {
      timeout = setTimeout(() => setActiveStep(1), 250);
    } else {
      timeout = setTimeout(() => setActiveStep(0), 250);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
    >
      <div className={`transition-opacity duration-300 ${activeStep === 0 ? "opacity-100" : "opacity-0"}`}>
        {firstContent}
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${activeStep === 1 ? "opacity-100" : "opacity-0"}`}>
        {secondContent}
      </div>

      {/* Pixel Grid Mask Layer */}
      <div className={`pointer-events-none absolute inset-0 grid grid-cols-7 grid-rows-7 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
        {Array.from({ length: 49 }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: pixelColor,
              animationDelay: `${(i % 7) * 30 + Math.floor(i / 7) * 20}ms`
            }}
            className={`${isHovered ? "scale-100" : "scale-0"} transition-transform duration-300 ease-out`}
          />
        ))}
      </div>
    </div>
  );
};
```

---

### C. `Dock` (macOS Proximity Magnification Bar)
```tsx
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

function DockIcon({ mouseX, icon, label }: { mouseX: any; icon: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [44, 72, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 200, damping: 14 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height: width }}
      className="group relative flex aspect-square cursor-pointer items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
    >
      <div className="text-xl">{icon}</div>
      <span className="absolute -top-8 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </motion.div>
  );
}

export const Dock = ({ items }: { items: { icon: React.ReactNode; label: string }[] }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-3 rounded-3xl border border-white/15 bg-black/40 px-4 pb-3 backdrop-blur-2xl"
    >
      {items.map((item, i) => (
        <DockIcon key={i} mouseX={mouseX} icon={item.icon} label={item.label} />
      ))}
    </div>
  );
};
```

---

### D. `TiltedCard` (3D Parallax Tilt with Glare)
```tsx
import { useState, useRef } from "react";
import { motion } from "motion/react";

export const TiltedCard = ({
  children,
  maxTilt = 15,
  className = ""
}: {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((-y / (rect.height / 2)) * maxTilt);
    setRotateY((x / (rect.width / 2)) * maxTilt);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};
```

---

### E. `InfiniteScroll` (Seamless Infinite Loop Marquee)
```tsx
import { motion } from "motion/react";

export const InfiniteScroll = ({
  items,
  speed = 25,
  direction = "left",
  pauseOnHover = true
}: {
  items: React.ReactNode[];
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}) => {
  return (
    <div className={`group flex overflow-hidden ${pauseOnHover ? "[&:hover_div]:[animation-play-state:paused]" : ""}`}>
      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity
        }}
        className="flex shrink-0 items-center gap-6"
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
```

---

### F. `CountUp` / `Counter` (Spring Animated Number Ticker)
```tsx
import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "motion/react";

export const CountUp = ({
  to,
  from = 0,
  duration = 2,
  className = ""
}: {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(from);
  const springVal = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(to);
  }, [inView, to, motionVal]);

  useEffect(() => {
    return springVal.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest));
      }
    });
  }, [springVal]);

  return <span ref={ref} className={className}>{from}</span>;
};
```

---

## 4. Backgrounds (`Backgrounds`)

### A. `Hyperspeed` (Three.js Warp Speed Starfield)
Generates high-speed starfield and road light trails using WebGL:

```tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hyperspeed = ({
  speed = 1.5,
  starCount = 1000,
  color = "#FF5A1F"
}: {
  speed?: number;
  starCount?: number;
  color?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = (Math.random() - 0.5) * 800;
      positions[i + 2] = Math.random() * 800;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: new THREE.Color(color), size: 2 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let animId: number;
    const animate = () => {
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 2; i < starCount * 3; i += 3) {
        pos[i] -= speed * 4;
        if (pos[i] < 0) pos[i] = 800;
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [speed, starCount, color]);

  return <div ref={containerRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
```

---

### B. `Ballpit` (Interactive 3D Physics Bouncing Balls)
Renders interactive spheres with gravity, collision detection, and mouse cursor repulsion:

```tsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Ballpit = ({ count = 40, colors = ["#FF5A1F", "#3B82F6", "#F59E0B"] }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const spheres: { mesh: THREE.Mesh; vx: number; vy: number; vz: number }[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.75, 32, 32);

    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        roughness: 0.2,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4);
      scene.add(mesh);
      spheres.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        vz: (Math.random() - 0.5) * 0.02
      });
    }

    let animId: number;
    const animate = () => {
      spheres.forEach((s) => {
        s.mesh.position.x += s.vx;
        s.mesh.position.y += s.vy;
        s.mesh.position.z += s.vz;

        if (Math.abs(s.mesh.position.x) > 7) s.vx *= -1;
        if (Math.abs(s.mesh.position.y) > 4) s.vy *= -1;
        if (Math.abs(s.mesh.position.z) > 2) s.vz *= -1;
      });

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [count, colors]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};
```

---

### C. `Aurora` (Flowing Ambient Aurora Waves)
```tsx
export const Aurora = ({ colorStops = ["#FF5A1F", "#3B82F6", "#8B5CF6"] }) => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-950">
      <div
        className="absolute -top-[40%] -left-[20%] h-[180%] w-[140%] opacity-40 blur-[120px] filter animate-aurora"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 50%, ${colorStops.join(", ")})`,
          backgroundSize: "200% 200%"
        }}
      />
    </div>
  );
};
```

---

### D. `Squares` (Interactive Matrix Grid)
```tsx
import { useEffect, useRef } from "react";

export const Squares = ({
  squareSize = 40,
  borderColor = "rgba(255, 255, 255, 0.05)",
  hoverFillColor = "rgba(255, 90, 31, 0.15)"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / squareSize);
      const rows = Math.ceil(canvas.height / squareSize);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * squareSize;
          const y = j * squareSize;
          const dist = Math.hypot(x + squareSize / 2 - mouseRef.current.x, y + squareSize / 2 - mouseRef.current.y);

          if (dist < 120) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
          }
          ctx.strokeStyle = borderColor;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [squareSize, borderColor, hoverFillColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-auto h-full w-full" />;
};
```

---

## 5. Animations & Micro-Interactions (`Animations`)

### A. `Magnet` (Magnetic Pull Effect)
```tsx
import { useRef, useState } from "react";
import { motion } from "motion/react";

export const Magnet = ({
  children,
  padding = 40,
  magnetStrength = 2
}: {
  children: React.ReactNode;
  padding?: number;
  magnetStrength?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    if (Math.abs(distX) < width / 2 + padding && Math.abs(distY) < height / 2 + padding) {
      setPosition({ x: distX / magnetStrength, y: distY / magnetStrength });
    }
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.2 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};
```

---

### B. `ClickSpark` (Geometric Canvas Particle Burst)
```tsx
import React, { useRef, useEffect } from "react";

export const ClickSpark = ({
  sparkColor = "#FF5A1F",
  sparkSize = 10,
  sparkCount = 8,
  duration = 400,
  children
}: {
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
  children: React.ReactNode;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<{ x: number; y: number; angle: number; startTime: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed > duration) return false;
        const progress = elapsed / duration;
        const dist = progress * 40;
        const currentX = spark.x + Math.cos(spark.angle) * dist;
        const currentY = spark.y + Math.sin(spark.angle) * dist;
        const currentSize = sparkSize * (1 - progress);

        ctx.fillStyle = sparkColor;
        ctx.beginPath();
        ctx.arc(currentX, currentY, currentSize, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [sparkColor, sparkSize, duration]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (i * 2 * Math.PI) / sparkCount,
        startTime: now
      });
    }
  };

  return (
    <div onClick={handleClick} className="relative inline-block overflow-visible">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="pointer-events-none absolute -inset-16 z-50 h-[calc(100%+8rem)] w-[calc(100%+8rem)]"
      />
      {children}
    </div>
  );
};
```

---

### C. `StarBorder` (Glowing Animated Perimeter Border)
Draws an orbital glowing gradient continuously sweeping around a card perimeter:

```tsx
export const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "#FF5A1F",
  speed = "6s",
  children,
  ...props
}: any) => {
  return (
    <Component className={`relative inline-block overflow-hidden rounded-xl p-[1px] ${className}`} {...props}>
      <div
        className="absolute inset-[-100%] animate-spin-slow opacity-80"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 340deg, ${color} 360deg)`,
          animationDuration: speed
        }}
      />
      <div className="relative z-10 rounded-[11px] bg-slate-900 px-6 py-3 font-semibold text-white">
        {children}
      </div>
    </Component>
  );
};
```

---

## 6. Production Guidelines for React Bits

1. **Hardware Acceleration**: Always compose animations using `transform`, `opacity`, and `filter`.
2. **Canvas/WebGL Lifecycle**: Ensure every `requestAnimationFrame`, Three.js renderer, and canvas event listener is cancelled/disposed in the `useEffect` cleanup return.
3. **Respect `prefers-reduced-motion`**:
   ```tsx
   import { useReducedMotion } from "motion/react";
   const shouldReduce = useReducedMotion();
   if (shouldReduce) return <div>{text}</div>;
   ```
4. **Touchscreen Handling**: Hover-dependent components (`SpotlightCard`, `Magnet`, `Dock`, `TiltedCard`) must provide clean, accessible tap states on touchscreens.
