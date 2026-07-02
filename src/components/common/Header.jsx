import { useState, useEffect } from 'react';
import { Menu, X, Store, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FullscreenMenu from './FullscreenMenu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userData, setIsLoginModalOpen } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      // General scrolled state for background blur
      setScrolled(window.scrollY > 50);

      // Dynamic text color logic
      if (location.pathname === '/') {
        // On home page, text is white over the hero video (first 100vh), then turns dark
        setIsDarkText(window.scrollY > window.innerHeight - 80);
      } else {
        // On all other pages (Store, Product, Checkout), text is always dark
        setIsDarkText(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount and route change
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const textColorClass = isDarkText ? 'text-textPrimary' : 'text-white';
  const headerBgClass = scrolled && !menuOpen ? 'bg-bgPrimary/80 backdrop-blur-md border-b border-border' : 'bg-transparent';
  
  // When menu is open, force dark text because menu background is light
  const finalTextColor = menuOpen ? 'text-textPrimary' : textColorClass;

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-lux px-4 py-4 md:px-6 md:py-5 flex items-center justify-between ${headerBgClass}`}
      >
        <div className="flex items-center gap-6 z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`${finalTextColor} hover:opacity-70 transition-colors duration-300 relative flex items-center justify-center`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" /> : <Menu strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />}
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <Link to="/" className="pointer-events-auto block">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex items-center justify-center hover:opacity-80 transition-opacity duration-500"
            >
              <img 
                src="/logo.png" 
                alt="Basha Monogram" 
                className="h-6 sm:h-7 md:h-10 origin-center w-auto object-contain"
              />
            </motion.div>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6 z-50">
          <Link 
            to="/store" 
            onClick={() => setMenuOpen(false)}
            className={`${finalTextColor} flex hover:opacity-70 transition-colors duration-300 relative items-center justify-center`} 
            aria-label="Store"
          >
            <Store strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
          </Link>

          <button
            onClick={() => {
              if (currentUser) {
                navigate(userData?.role === 'admin' ? '/admin' : '/profile');
              } else {
                setIsLoginModalOpen(true);
              }
              setMenuOpen(false);
            }}
            className={`${finalTextColor} hover:opacity-70 transition-colors duration-300 relative flex items-center justify-center`}
            aria-label="Profile"
          >
            <User strokeWidth={1.5} className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </header>
      
      <AnimatePresence>
        {menuOpen && <FullscreenMenu onClose={() => setMenuOpen(false)} />}
      </AnimatePresence>
    </>
  );
}


