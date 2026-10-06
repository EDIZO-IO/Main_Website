import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('edizo_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('edizo_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('edizo_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-50 bg-white/95 dark:bg-navy-light/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-navy/10 dark:border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <Cookie size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-navy dark:text-white mb-1.5">Cookie Preferences</h4>
              <p className="text-xs text-navy/70 dark:text-white/70 leading-relaxed mb-4">
                We use cookies and local storage to optimize performance, remember your theme preferences, and improve user experience. Read our{' '}
                <Link to="/cookies" className="text-orange font-semibold hover:underline">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-orange font-semibold hover:underline">
                  Privacy Policy
                </Link>.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-orange text-white rounded-full text-xs font-bold hover:bg-orange-dark transition-all shadow-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 bg-navy/5 dark:bg-white/10 text-navy dark:text-white rounded-full text-xs font-bold hover:bg-navy/10 dark:hover:bg-white/20 transition-all"
                >
                  Essential Only
                </button>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="text-navy/40 dark:text-white/40 hover:text-navy dark:hover:text-white p-1"
              aria-label="Close Cookie Banner"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
