import { useEffect, useState, useRef } from 'react';

/**
 * CountUp - Smooth easing numeric counter when scrolled into view
 */
const CountUp = ({
  to = 0,
  from = 0,
  duration = 2,
  separator = ',',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const target = typeof to === 'string' ? parseFloat(to.replace(/[^0-9.-]/g, '')) || 0 : to;
          const startVal = typeof from === 'string' ? parseFloat(from.replace(/[^0-9.-]/g, '')) || 0 : from;
          const totalMs = duration * 1000;

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / totalMs, 1);
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(startVal + (target - startVal) * easeOutProgress);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, from, duration]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

export default CountUp;
