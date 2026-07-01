import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function FloatingCart() {
  const { cartItems, toggleCart, isCartOpen } = useCart();
  const location = useLocation();
  
  return (
    <AnimatePresence>
      {cartItems.length > 0 && !isCartOpen && location.pathname !== '/checkout' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={toggleCart}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-textPrimary text-bgPrimary rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-colors"
          aria-label="Shopping bag"
        >
          <div className="relative">
            <ShoppingBag strokeWidth={1.5} className="w-7 h-7" />
            <span className="absolute -top-2 -right-2 bg-white text-textPrimary text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-sans font-bold shadow-sm">
              {cartItems.length}
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
