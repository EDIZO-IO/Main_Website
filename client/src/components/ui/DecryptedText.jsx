import { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

/**
 * DecryptedText - Cyberpunk character scrambling reveal animation
 */
const DecryptedText = ({
  text = '',
  speed = 30,
  maxIterations = 12,
  trigger = 'hover', // 'hover' | 'view'
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }
      iteration += 1 / (maxIterations / Math.max(text.length, 1));
    }, speed);
  };

  useEffect(() => {
    setDisplayText(text);
    if (trigger === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startScramble();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      if (containerRef.current) observer.observe(containerRef.current);
      return () => {
        observer.disconnect();
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, trigger]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => trigger === 'hover' && startScramble()}
      className={`font-mono inline-block ${className}`}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
