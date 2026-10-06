import { motion } from 'framer-motion';

/**
 * SplitText - Staggered token reveal animation using Framer Motion
 */
const SplitText = ({
  text = '',
  className = '',
  delay = 40,
  splitBy = 'words', // 'words' | 'characters'
}) => {
  if (splitBy === 'characters') {
    const chars = text.split('');
    return (
      <span className={`inline-block overflow-hidden ${className}`}>
        {chars.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: (index * delay) / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    );
  }

  const words = text.split(' ');
  return (
    <span className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden">
          <motion.span
            initial={{ opacity: 0, y: '100%' }}
            whileInView={{ opacity: 1, y: '0%' }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: (wordIndex * delay) / 1000,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default SplitText;
