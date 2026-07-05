import { ArrowUpRight } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import logoImg from '../assets/images/edizo_logo.png';
import nameImg from '../assets/images/edizo-name.png';

const Footer = () => {
  const [services, setServices] = useState([]);
  const { settings } = useSite();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://100.110.78.25:5000';
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        setServices(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error("Failed to fetch services for footer", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <footer className="bg-grey-dark text-white pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange to-orange-dark" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logoImg} alt="EDIZO Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              <img src={nameImg} alt="EDIZO" className="h-6 w-auto object-contain brightness-0 invert mt-1" />
            </Link>
            <p className="text-grey-silver/70 mb-8 max-w-sm">
              Designing and developing next-generation software products and building the technical leaders of tomorrow.
            </p>
            <div className="flex gap-4">
              {settings?.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange transition-colors"><FaTwitter size={20} /></a>
              )}
              {settings?.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange transition-colors"><FaLinkedin size={20} /></a>
              )}
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange transition-colors"><FaFacebook size={20} /></a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange transition-colors"><FaInstagram size={20} /></a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4 text-grey-silver/70">
              {services.length > 0 ? services.map(service => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`} className="hover:text-orange transition-colors">
                    {service.title}
                  </Link>
                </li>
              )) : (
                <li>Loading services...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4 text-grey-silver/70">
              <li><Link to="/" className="hover:text-orange transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-orange transition-colors">Our Work</Link></li>
              <li><Link to="/internships" className="hover:text-orange transition-colors">Edizo Academy</Link></li>
              <li><Link to="/contact" className="hover:text-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-grey-silver/70">
              <li><a href="#" className="hover:text-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-orange transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-grey-silver/50 text-sm">
            &copy; {new Date().getFullYear()} EDIZO. All rights reserved.
          </p>
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-grey-silver/50 text-sm hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to Top</span>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
