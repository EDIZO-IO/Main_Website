import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoImg from '../assets/images/edizo_logo.png';
import nameImg from '../assets/images/edizo-name.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Internships', href: '/internships' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="EDIZO Logo" className="h-10 w-auto object-contain" />
          <img src={nameImg} alt="EDIZO" className="h-6 w-auto object-contain mt-1" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.href} className={`font-medium transition-colors ${location.pathname === link.href ? 'text-orange' : 'text-grey-medium hover:text-orange'}`}>
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 border-l border-grey-silver pl-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 font-medium text-grey-dark hover:text-orange transition-colors">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 font-medium text-red-500 hover:text-red-600 transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 font-medium text-grey-dark hover:text-orange transition-colors">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-orange text-white rounded-full font-bold hover:bg-orange-dark transition-all shadow-md hover:shadow-lg">
                  Register
                </Link>
              </>
            )}
            <Link to="/contact" className="px-5 py-2.5 bg-grey-dark text-white rounded-full font-medium hover:bg-black transition-colors ml-2">
              Let's Talk
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-grey-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 mt-4 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className={`font-medium text-lg border-b border-grey-silver/50 pb-2 ${location.pathname === link.href ? 'text-orange' : 'text-grey-dark'}`}>
                  {link.name}
                </Link>
              ))}
              
              <div className="border-b border-grey-silver/50 pb-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-lg text-grey-dark">
                      <User size={18} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-2 font-medium text-lg text-red-500">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-lg text-grey-dark">
                      <LogIn size={18} /> Login
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-lg text-grey-dark">
                      <User size={18} /> Register
                    </Link>
                  </>
                )}
              </div>
              
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full text-center mt-2 px-6 py-3 bg-orange text-white rounded-lg font-medium">
                Let's Talk
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
