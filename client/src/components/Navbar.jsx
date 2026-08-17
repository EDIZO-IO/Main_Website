import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoImg from '../assets/images/edizo_logo.png';
import nameImg from '../assets/images/edizo-name.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic Theme Handler
  const updateThemeMode = useCallback((targetMode) => {
    const shouldBeDark = targetMode === 'dark';
    document.documentElement.classList.toggle('dark', shouldBeDark);
    localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light');
    setIsDarkMode(shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    updateThemeMode(isDarkMode ? 'light' : 'dark');
  };

  // Initialize theme dynamically from localStorage (Default: light)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    updateThemeMode(savedTheme);
  }, [updateThemeMode]);

  // Dynamic Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOW WE WORK', href: '/#how-we-work' },
    { name: 'SERVICES', href: '/services' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'INTERNSHIP', href: '/internships' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled || location.pathname !== '/' ? 'glass py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="EDIZO Logo" className="h-9 w-auto object-contain dark:invert dark:brightness-0" />
          <img src={nameImg} alt="EDIZO" className="h-5 w-auto object-contain mt-1 dark:invert dark:brightness-0" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className={`text-sm font-semibold tracking-wide transition-colors ${location.pathname === link.href ? 'text-orange' : 'text-navy hover:text-orange'}`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
            {/* Dynamic Navbar Dark Theme Toggle Button */}
            <button 
                onClick={toggleDarkMode} 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-navy/10 hover:border-orange hover:bg-orange/5 transition-all text-xs font-extrabold text-navy dark:text-white dark:border-white/20"
                aria-label="Toggle Dark Mode"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {isDarkMode ? (
                  <>
                    <Sun size={15} className="text-orange animate-spin-slow" />
                    <span>LIGHT</span>
                  </>
                ) : (
                  <>
                    <Moon size={15} className="text-navy" />
                    <span>DARK</span>
                  </>
                )}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-full border border-navy/10 text-navy text-sm font-bold hover:bg-orange hover:text-white hover:border-orange transition-all dark:text-white dark:border-white/20">
                    <User size={16} />
                    DASHBOARD
                </Link>
                <button onClick={logout} className="text-sm font-bold text-navy/60 hover:text-red-500 transition-colors dark:text-white/60">
                  LOGOUT
                </button>
              </>
            ) : (
              <Link to="/login" className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy hover:bg-orange hover:text-white hover:border-orange transition-all dark:text-white dark:border-white/20">
                  <User size={18} />
              </Link>
            )}
            <Link to="/contact" className="px-6 py-2.5 bg-navy dark:bg-white dark:text-navy text-white rounded-full text-sm font-semibold hover:bg-orange dark:hover:bg-orange dark:hover:text-white transition-all shadow-md">
              START A PROJECT
            </Link>
        </div>

        {/* Mobile Toggle & Dark Mode */}
        <div className="lg:hidden flex items-center gap-2">
          <button 
            onClick={toggleDarkMode} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy/10 text-xs font-bold text-navy dark:text-white dark:border-white/20"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} className="text-orange" /> : <Moon size={16} className="text-navy" />}
            <span>{isDarkMode ? 'LIGHT' : 'DARK'}</span>
          </button>
          <button 
            className="text-navy p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/20 mt-4 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className={`font-display font-bold text-xl border-b border-navy/5 pb-3 ${location.pathname === link.href ? 'text-orange' : 'text-navy'}`}>
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-display font-bold text-xl border-b border-navy/5 pb-3 text-orange flex items-center gap-2">
                    <User size={20} /> DASHBOARD
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left font-display font-bold text-xl border-b border-navy/5 pb-3 text-red-500">
                    LOGOUT
                  </button>
                </>
              )}
              
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center mt-4 px-6 py-4 bg-navy dark:bg-white dark:text-navy text-white rounded-xl font-display font-bold text-lg">
                START A PROJECT
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
