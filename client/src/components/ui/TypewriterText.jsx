import { useState, useEffect } from 'react';

/**
 * TypewriterText - Smooth typing and looping text animation
 * @param {string[]|string} texts - Array of strings to cycle through (or single string)
 * @param {number} typingSpeed - Delay in ms per character while typing
 * @param {number} deletingSpeed - Delay in ms per character while deleting
 * @param {number} pauseDuration - Delay in ms before deleting
 * @param {string} className - Additional CSS classes
 * @param {string} cursorColor - Custom color for the blinking cursor
 * @param {boolean} loop - Whether to continuously cycle
 */
const TypewriterText = ({
  texts = [],
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 2000,
  className = '',
  cursorColor = 'text-[#D93800] dark:text-[#FF855C]',
  loop = true,
}) => {
  const textArray = Array.isArray(texts) ? texts : [texts];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (textArray.length === 0) return;

    const fullText = textArray[currentTextIndex];
    let timeout;

    if (!isDeleting && currentText === fullText) {
      if (!loop && currentTextIndex === textArray.length - 1) return;
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
    } else {
      const speed = isDeleting ? deletingSpeed : typingSpeed;
      timeout = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? fullText.substring(0, currentText.length - 1)
            : fullText.substring(0, currentText.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, textArray, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={`inline-flex items-center whitespace-nowrap ${className}`}>
      <span>{currentText}</span>
      <span className={`inline-block w-[2px] h-[1em] ml-0.5 bg-current animate-pulse ${cursorColor}`} />
    </span>
  );
};

export default TypewriterText;
