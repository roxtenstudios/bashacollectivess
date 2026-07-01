import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { currentUser, setIsLoginModalOpen } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsLoginModalOpen(true);
    } else {
      setIsCartOpen(false);
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-bgPrimary shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <span className="font-serif text-2xl text-textPrimary">Your Cart</span>
              <button onClick={() => setIsCartOpen(false)} className="text-textSecondary hover:text-textPrimary transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-textSecondary gap-4">
                  <span className="font-sans text-sm tracking-widest uppercase">Your cart is empty.</span>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="border-b border-textPrimary text-textPrimary font-sans text-xs tracking-widest uppercase pb-1 hover:opacity-70 transition-opacity"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={item.cartId || `${item.id}-${item.size}-${index}`} className="flex gap-4">
                    <div className="w-24 h-32 bg-[#FAFAFA] shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-serif text-lg text-textPrimary">{item.title}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size, item.customSize)}
                            className="text-textSecondary hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <span className="font-sans text-xs text-textSecondary">Size: {item.size}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-border h-8">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1, item.customSize)}
                            className="w-8 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-sans text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.customSize)}
                            className="w-8 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-sans text-sm tracking-widest">
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : (!isNaN(Number(String(item.price).replace(/[^0-9.]/g, ''))) ? Number(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2) : '0.00')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-border/30 flex flex-col gap-6 bg-[#FAFAFA]">
                <div className="flex justify-between items-center font-sans">
                  <span className="text-sm tracking-widest uppercase text-textSecondary">Subtotal</span>
                  <span className="text-lg tracking-widest text-textPrimary">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors"
                >
                  {currentUser ? 'Proceed to Checkout' : 'Login First'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
