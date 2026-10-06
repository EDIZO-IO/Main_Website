import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Magnet — React Bits magnetic pull interaction that pulls elements slightly towards the cursor.
 */
export const Magnet = ({
  children,
  padding = 35,
  magnetStrength = 2.5,
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
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
      transition={{ type: 'spring', stiffness: 380, damping: 20, mass: 0.2 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
