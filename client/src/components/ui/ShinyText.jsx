import React from 'react';

/**
 * ShinyText — React Bits animated metallic light sweep across typography.
 */
export const ShinyText = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
  children
}) => {
  const content = text || children;
  
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${
        disabled
          ? 'text-navy/70 dark:text-white/70'
          : 'bg-gradient-to-r from-[#C43802] via-[#FF5A1F] to-[#E04812] dark:from-white dark:via-[#FF855C] dark:to-white'
      } ${className}`}
      style={{
        backgroundImage: disabled
          ? undefined
          : 'linear-gradient(110deg, currentColor 20%, #FF5A1F 45%, #FF855C 55%, currentColor 80%)',
        backgroundSize: '220% 100%',
        WebkitBackgroundClip: 'text',
        animation: disabled ? 'none' : `shine ${speed}s linear infinite`
      }}
    >
      {content}
    </span>
  );
};

export default ShinyText;
