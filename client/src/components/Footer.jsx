import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube, FaFacebook, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import logoImg from '../assets/images/edizo_logo.png';
import nameImg from '../assets/images/edizo-name.png';

const Footer = () => {
  const { settings: config } = useSite();

  return (
    <footer className="bg-[#0B132B] dark:bg-[#050B14] text-white pt-24 pb-12 relative overflow-hidden transition-colors duration-300 border-t border-white/5">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4 mb-6">
              <img src={logoImg} alt="EDIZO Logo" className="h-14 w-auto object-contain" />
              <img src={nameImg} alt={config.company_name || 'EDIZO'} className="h-8 w-auto object-contain mt-2" />
            </Link>
            <p className="text-slate-300/80 leading-relaxed mb-8 max-w-sm text-sm">
              {config.site_description || "Turning Ideas Into Digital Experiences. We build scalable software and nurture next-gen talent."}
            </p>
            {config.email_1 ? (
              <a href={`mailto:${config.email_1}`} className="text-slate-200 font-bold hover:text-orange transition-colors flex items-center gap-2.5 mb-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange shrink-0">
                  <Mail size={13} />
                </div>
                <span>{config.email_1}</span>
              </a>
            ) : (
              <a href="mailto:contact@edizo.in" className="text-slate-200 font-bold hover:text-orange transition-colors flex items-center gap-2.5 mb-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange shrink-0">
                  <Mail size={13} />
                </div>
                <span>contact@edizo.in</span>
              </a>
            )}
            {config.email_2 && (
              <a href={`mailto:${config.email_2}`} className="text-slate-200 font-bold hover:text-orange transition-colors flex items-center gap-2.5 mb-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange shrink-0">
                  <Mail size={13} />
                </div>
                <span>{config.email_2}</span>
              </a>
            )}
            {config.phone ? (
              <a href={`tel:${config.phone}`} className="text-slate-200 font-bold hover:text-orange transition-colors flex items-center gap-2.5 mt-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange shrink-0">
                  <Phone size={13} />
                </div>
                <span>{config.phone}</span>
              </a>
            ) : (
              <a href="tel:+919876543210" className="text-slate-200 font-bold hover:text-orange transition-colors flex items-center gap-2.5 mt-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-orange shrink-0">
                  <Phone size={13} />
                </div>
                <span>+91 98765 43210</span>
              </a>
            )}
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div>
              <h3 className="text-orange font-display font-bold tracking-wider text-xs mb-6 uppercase">Company</h3>
              <ul className="space-y-4 text-slate-300 font-medium text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> About Us</Link></li>
                <li><Link to="/projects" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Our Work</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Services</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-orange font-display font-bold tracking-wider text-xs mb-6 uppercase">Services</h3>
              <ul className="space-y-4 text-slate-300 font-medium text-sm">
                <li><Link to="/services" className="hover:text-white transition-colors block">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">App Development</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">UI/UX Design</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">SaaS Solutions</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">Digital Marketing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-orange font-display font-bold tracking-wider text-xs mb-6 uppercase">Learning</h3>
              <ul className="space-y-4 text-slate-300 font-medium text-sm">
                <li><Link to="/internships" className="hover:text-white transition-colors block">Internship Program</Link></li>
                <li><Link to="/internships" className="hover:text-white transition-colors block">Workshops</Link></li>
                <li><Link to="/internships" className="hover:text-white transition-colors block">Campus Mentorship</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-orange font-display font-bold tracking-wider text-xs mb-6 uppercase">Connect</h3>
              <ul className="space-y-4 text-slate-300 font-medium text-sm flex flex-col">
                <li>
                  <a href={config.linkedin_url || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-orange group-hover:text-white transition-colors"><FaLinkedin size={14} /></div>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a href={config.instagram_url || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-orange group-hover:text-white transition-colors"><FaInstagram size={14} /></div>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href={config.youtube_url || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-orange group-hover:text-white transition-colors"><FaYoutube size={14} /></div>
                    <span>YouTube</span>
                  </a>
                </li>
                <li>
                  <a href={config.x_url || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-orange group-hover:text-white transition-colors"><FaXTwitter size={14} /></div>
                    <span>X (Twitter)</span>
                  </a>
                </li>
                <li>
                  <a href={config.whatsapp_url || "https://whatsapp.com"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-200 group-hover:bg-orange group-hover:text-white transition-colors"><FaWhatsapp size={14} /></div>
                    <span>WhatsApp</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-400 text-sm font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} {config.company_name || 'EDIZO'}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
              <Link to="/privacy" className="hover:text-orange transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-orange transition-colors">Terms & Conditions</Link>
              <Link to="/cookies" className="hover:text-orange transition-colors">Cookie Policy</Link>
            </div>
          </div>
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-slate-400 text-sm font-medium hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to Top</span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-orange group-hover:border-orange group-hover:text-white transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
