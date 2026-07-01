import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/#about' },
  { name: 'Exclusive', path: '/#exclusive' },
  { name: 'Lookbook', path: '/#lookbook' },
  { name: 'Store', path: '/store' },
  { name: 'Contact Us', path: '/#newsletter' },
  { name: 'Checkout', path: '/checkout' }
];

export default function FullscreenMenu({ onClose }) {
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
        onClose();
      } else {
        navigate(path);
        onClose();
      }
    } else {
      e.preventDefault();
      navigate(path);
      onClose();
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: '-10%' },
    visible: { 
      opacity: 1, 
      y: '0%',
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
    },
    exit: { 
      opacity: 0, 
      y: '-10%',
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-40 bg-bgPrimary flex flex-col justify-center px-10"
    >
      <motion.nav variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-2 md:gap-4">
        {LINKS.map((link) => (
          <div key={link.name} className="overflow-hidden">
            <a
              href={link.path}
              onClick={(e) => handleLinkClick(e, link.path)}
              className="block"
            >
              <motion.span variants={linkVariants} className="block font-serif text-xl md:text-3xl text-textPrimary hover:opacity-60 transition-opacity duration-500">
                {link.name}
              </motion.span>
            </a>
          </div>
        ))}
      </motion.nav>
      
      <motion.div 
        variants={linkVariants}
        className="absolute bottom-10 left-10 text-sm text-textSecondary"
      >
        bashacollectives@gmail.com<br/>
        +91 761 778 7238<br/>
        Copenhagen, DK
      </motion.div>
    </motion.div>
  );
}
