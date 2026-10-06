import React, { useRef, useState } from 'react';

/**
 * SpotlightCard — React Bits inspired cursor-tracking radial glow card.
 * Works seamlessly in both light & dark themes.
 */
export const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 90, 31, 0.14)',
  darkSpotlightColor = 'rgba(255, 90, 31, 0.22)',
  onClick,
  ...props
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-navy/10 dark:border-white/10 bg-white dark:bg-[#0B132B]/90 transition-all duration-300 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 hidden sm:block"
        style={{
          opacity,
          background: `radial-gradient(550px circle at ${position.x}px ${position.y}px, var(--spotlight-color, ${spotlightColor}), transparent 75%)`
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default SpotlightCard;
