import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1, size = 'M', customSize = null) => {
    setCartItems(prev => {
      const customStr = customSize ? JSON.stringify(customSize) : null;
      const existing = prev.find(item => item.id === product.id && item.size === size && (item.customSize ? JSON.stringify(item.customSize) : null) === customStr);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size && (item.customSize ? JSON.stringify(item.customSize) : null) === customStr
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, size, customSize }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size, customSize = null) => {
    const customStr = customSize ? JSON.stringify(customSize) : null;
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.size === size && (item.customSize ? JSON.stringify(item.customSize) : null) === customStr)));
  };

  const updateQuantity = (productId, size, quantity, customSize = null) => {
    const customStr = customSize ? JSON.stringify(customSize) : null;
    if (quantity < 1) {
      removeFromCart(productId, size, customSize);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId && item.size === size && (item.customSize ? JSON.stringify(item.customSize) : null) === customStr
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const cartTotal = cartItems.reduce((total, item) => {
    const priceStr = typeof item.price === 'string' ? item.price : String(item.price || 0);
    const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      setIsCartOpen,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
