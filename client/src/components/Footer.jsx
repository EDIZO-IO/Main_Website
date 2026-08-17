import { ArrowUpRight } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram, FaYoutube, FaFacebook, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import logoImg from '../assets/images/edizo_logo.png';
import nameImg from '../assets/images/edizo-name.png';

const Footer = () => {
  const { settings: config } = useSite();

  return (
    <footer className="bg-navy text-white pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-4 mb-6">
              <img src={logoImg} alt="EDIZO Logo" className="h-14 w-auto object-contain brightness-0 invert" />
              <img src={nameImg} alt={config.company_name || 'EDIZO'} className="h-8 w-auto object-contain brightness-0 invert mt-2" />
            </Link>
            <p className="text-grey-silver/70 leading-relaxed mb-8 max-w-sm">
              {config.site_description || "Turning Ideas Into Digital Experiences. We build scalable software and nurture next-gen talent."}
            </p>
            {config.email_1 && (
              <a href={`mailto:${config.email_1}`} className="text-white font-bold hover:text-orange transition-colors block mb-1">
                {config.email_1}
              </a>
            )}
            {config.email_2 && (
              <a href={`mailto:${config.email_2}`} className="text-white font-bold hover:text-orange transition-colors block mb-1">
                {config.email_2}
              </a>
            )}
            {config.email_3 && (
              <a href={`mailto:${config.email_3}`} className="text-white font-bold hover:text-orange transition-colors block mb-2">
                {config.email_3}
              </a>
            )}
            {config.phone && (
              <a href={`tel:${config.phone}`} className="text-white font-bold hover:text-orange transition-colors block">
                {config.phone}
              </a>
            )}
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div>
              <h4 className="text-white font-display font-bold tracking-widest text-sm mb-6 uppercase text-orange">Company</h4>
              <ul className="space-y-4 text-grey-silver/80 font-medium text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> About Us</Link></li>
                <li><Link to="/projects" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Our Work</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Services</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-orange/50 group-hover:bg-orange transition-colors"></span> Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-display font-bold tracking-widest text-sm mb-6 uppercase text-orange">Services</h4>
              <ul className="space-y-4 text-grey-silver/80 font-medium text-sm">
                <li><Link to="/services" className="hover:text-white transition-colors block">Web Development</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">App Development</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">UI/UX Design</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">SaaS Solutions</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors block">Digital Marketing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-display font-bold tracking-widest text-sm mb-6 uppercase text-orange">Learning</h4>
              <ul className="space-y-4 text-grey-silver/80 font-medium text-sm">
                <li><Link to="/internships" className="hover:text-white transition-colors block">Internship Program</Link></li>
                <li><Link to="/internships" className="hover:text-white transition-colors block">Workshops</Link></li>
                <li><Link to="/internships" className="hover:text-white transition-colors block">Campus Mentorship</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-display font-bold tracking-widest text-sm mb-6 uppercase text-orange">Connect</h4>
              <ul className="space-y-4 text-grey-silver/80 font-medium text-sm flex flex-col">
                {config.linkedin_url && (
                  <li>
                    <a href={config.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaLinkedin size={14} /></div>
                      LinkedIn
                    </a>
                  </li>
                )}
                {config.instagram_url && (
                  <li>
                    <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaInstagram size={14} /></div>
                      Instagram
                    </a>
                  </li>
                )}
                {config.youtube_url && (
                  <li>
                    <a href={config.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaYoutube size={14} /></div>
                      YouTube
                    </a>
                  </li>
                )}
                {config.x_url && (
                  <li>
                    <a href={config.x_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaXTwitter size={14} /></div>
                      X (Twitter)
                    </a>
                  </li>
                )}
                {config.whatsapp_url && (
                  <li>
                    <a href={config.whatsapp_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaWhatsapp size={14} /></div>
                      WhatsApp Channel
                    </a>
                  </li>
                )}
                {config.facebook_url && (
                  <li>
                    <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors"><FaFacebook size={14} /></div>
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-grey-silver/50 text-sm font-medium">
            &copy; {new Date().getFullYear()} {config.company_name || 'EDIZO'}. All rights reserved.
          </p>
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-grey-silver/50 text-sm font-medium hover:text-white transition-colors cursor-pointer group"
          >
            <span>Back to Top</span>
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-orange group-hover:border-orange group-hover:text-white transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
