import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Moon, Sun, ArrowRight } from 'lucide-react';
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
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOW WE WORK', href: '/#how-we-work' },
    { name: 'SERVICES', href: '/services' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'INTERNSHIPS', href: '/internships' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass py-2.5 shadow-sm' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoImg} alt="EDIZO Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-200" />
          <img src={nameImg} alt="EDIZO" className="h-5 w-auto object-contain mt-1" />
        </Link>

        {/* Desktop Nav with Motion layoutId pill */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-white/80 dark:bg-[#0B132B]/80 backdrop-blur-xl border border-grey-silver/80 dark:border-white/10 shadow-xs">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href.startsWith('/#') && location.hash === link.href.replace('/', ''));
            return (
              <Link 
                key={link.name} 
                to={link.href} 
                className={`relative px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider transition-colors duration-200 ${
                  isActive 
                    ? 'text-white dark:text-[#0B132B] font-black' 
                    : 'text-grey-dark/80 dark:text-white/80 hover:text-orange dark:hover:text-orange'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-[#0B132B] dark:bg-white rounded-full z-0 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dynamic Theme Toggle Button */}
          <button 
            onClick={toggleDarkMode} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grey-silver/80 dark:border-white/15 hover:border-orange hover:bg-orange/5 transition-all text-xs font-extrabold text-grey-dark dark:text-white cursor-pointer"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <Sun size={14} className="text-orange animate-spin-slow" />
                <span>LIGHT</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-grey-dark" />
                <span>DARK</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-grey-silver/80 text-grey-dark dark:text-white dark:border-white/15 text-xs font-bold hover:border-orange hover:text-orange transition-all"
                aria-label="User Account Menu"
              >
                <User size={14} />
                <span>ACCOUNT</span>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#0B132B] rounded-2xl shadow-xl border border-grey-silver/80 dark:border-white/10 py-2 hidden group-hover:block transition-all z-50">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-grey-dark dark:text-white hover:bg-orange/10 hover:text-orange">
                  Dashboard
                </Link>
                <button 
                  onClick={logout} 
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="w-9 h-9 rounded-full border border-grey-silver/80 dark:border-white/15 flex items-center justify-center text-grey-dark hover:bg-orange hover:text-white hover:border-orange transition-all dark:text-white"
              aria-label="Sign In"
            >
              <User size={15} />
            </Link>
          )}

          <Link 
            to="/contact" 
            className="group inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-orange/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>START A PROJECT</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full border border-grey-silver/80 text-grey-dark dark:text-white dark:border-white/15"
            aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={16} className="text-orange" /> : <Moon size={16} />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-grey-dark dark:text-white focus:outline-hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-[#060B13]/95 backdrop-blur-2xl border-b border-grey-silver/80 dark:border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-bold text-grey-dark dark:text-white hover:text-orange transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-navy/10 dark:border-white/10 flex flex-col gap-3">
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[#D93800] to-[#FF5A1F] text-white rounded-full text-center font-bold text-sm shadow-md"
                >
                  Start A Project
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
