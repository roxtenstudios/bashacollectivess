import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const hash = path.replace('/#', '');
      if (location.pathname === '/') {
        const element = document.getElementById(hash);
        if (element) {
          window.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
        }
      } else {
        navigate(path);
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full bg-[#FAFAFA] text-textPrimary pt-24 pb-8 px-6 md:px-12 flex flex-col justify-between rounded-t-[40px] md:rounded-t-[80px] -mt-10 relative z-40 border-t border-border/30 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      
      {/* Top Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-8 mb-24">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6 md:max-w-sm">
          <h2 className="font-serif text-3xl md:text-5xl tracking-widest uppercase text-textPrimary">
            Basha<br />Collectives
          </h2>
          <p className="font-sans font-light text-sm text-textSecondary leading-relaxed">
            Redefining modern luxury through intentional design, heritage craftsmanship, and avant-garde silhouettes.
          </p>
          <div className="flex flex-col gap-1 font-sans text-xs text-textSecondary mt-2">
            <a href="mailto:bashacollectives@outlook.com" className="hover:text-textPrimary transition-colors">bashacollectives@outlook.com</a>
            <a href="tel:+917617787238" className="hover:text-textPrimary transition-colors">+91 761 778 7238 (Support / WhatsApp)</a>
          </div>
          <a href="/#newsletter" onClick={(e) => handleLinkClick(e, '/#newsletter')} className="w-fit text-xs font-sans tracking-[0.2em] uppercase border-b border-border pb-1 hover:border-textPrimary transition-colors mt-4 text-textPrimary">
            Join The List
          </a>
        </div>

        {/* Links Columns */}
        <div className="flex gap-16 md:gap-24">
          <div className="flex flex-col gap-6">
            <span className="font-sans text-[10px] tracking-widest uppercase text-textSecondary/60">Explore</span>
            <ul className="flex flex-col gap-4 font-serif text-lg text-textPrimary/80">
              <li><Link to="/store" className="hover:text-accent transition-colors">The Main Store</Link></li>
              <li><a href="/#bestsellers" onClick={(e) => handleLinkClick(e, '/#bestsellers')} className="hover:text-accent transition-colors">Best Sellers</a></li>
              <li><a href="/#lookbook" onClick={(e) => handleLinkClick(e, '/#lookbook')} className="hover:text-accent transition-colors">Lookbook</a></li>
              <li><a href="/#collection" onClick={(e) => handleLinkClick(e, '/#collection')} className="hover:text-accent transition-colors">Collections</a></li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-6">
            <span className="font-sans text-[10px] tracking-widest uppercase text-textSecondary/60">Social</span>
            <ul className="flex flex-col gap-4 font-serif text-lg text-textPrimary/80">
              <li><a href="https://instagram.com/bashacollectives" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-1">Instagram <ArrowUpRight size={14}/></a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-6">
        <span className="font-sans text-xs text-textSecondary/60 tracking-wider">
          &copy; {new Date().getFullYear()} BASHA COLLECTIVES. ALL RIGHTS RESERVED.
        </span>
        
        <div className="flex gap-6 font-sans text-xs text-textSecondary/60 tracking-wider uppercase">
          <Link to="/" className="hover:text-textPrimary transition-colors">Privacy</Link>
          <Link to="/" className="hover:text-textPrimary transition-colors">Terms</Link>
        </div>

        <button 
          onClick={scrollToTop}
          className="font-sans text-xs tracking-widest uppercase text-textSecondary/60 hover:text-textPrimary transition-colors"
        >
          Back To Top &uarr;
        </button>
      </div>

    </footer>
  );
}
