import React from 'react';
import { motion } from 'framer-motion';

/**
 * BlurText — React Bits progressive blur-to-focus text animation.
 */
export const BlurText = ({
  text = '',
  delay = 45,
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top' // 'top' | 'bottom'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{
            filter: 'blur(10px)',
            opacity: 0,
            y: direction === 'top' ? -15 : 15
          }}
          whileInView={{
            filter: 'blur(0px)',
            opacity: 1,
            y: 0
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: (index * delay) / 1000,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="inline-block mr-[0.25em]"
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;
