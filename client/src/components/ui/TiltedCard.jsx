import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * TiltedCard — React Bits 3D perspective parallax tilt effect responding to cursor motion.
 */
export const TiltedCard = ({
  children,
  maxTilt = 10,
  glare = true,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotX = -((y - centerY) / centerY) * maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;
    
    setRotateX(rotX);
    setRotateY(rotY);
    
    if (glare) {
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.4
      });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: '1200px' }} className="inline-block w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative overflow-hidden rounded-3xl ${className}`}
        {...props}
      >
        {children}
        
        {/* Dynamic Glare Overlay */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden sm:block"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.25), transparent 70%)`
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default TiltedCard;
