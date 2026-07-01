import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS } from '../../pages/Store';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // In a real app, this might go to a search results page.
      // For this demo, we can just navigate to the store.
      navigate('/store');
      onClose();
    }
  };

  // Filter products or show bestsellers
  const displayProducts = useMemo(() => {
    if (!query.trim()) {
      // Return 4 bestsellers when empty
      return ALL_PRODUCTS.slice(0, 4);
    }
    return ALL_PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] bg-bgPrimary/95 backdrop-blur-md flex flex-col pt-32 items-center px-6 overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-6 text-textPrimary hover:opacity-50 transition-opacity"
            aria-label="Close search"
          >
            <X strokeWidth={1.5} size={32} />
          </button>

          {/* Search Form */}
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-3xl flex items-center border-b border-textPrimary pb-4 relative shrink-0"
          >
            <Search className="text-textSecondary mr-4" strokeWidth={1.5} size={28} />
            <input
              type="text"
              placeholder="SEARCH..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-textPrimary font-sans text-xl md:text-3xl tracking-[0.2em] uppercase focus:outline-none placeholder:text-textSecondary/50"
              autoFocus
            />
          </form>
          
          {/* Results Area */}
          <div className="w-full max-w-5xl mt-12 mb-12 flex flex-col gap-6">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-sans text-xs tracking-widest text-textSecondary uppercase"
            >
              {query.trim() ? `Results for "${query}"` : 'Bestsellers'}
            </motion.h3>

            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {displayProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link 
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="group flex flex-col gap-3"
                    >
                      <div className="w-full aspect-[3/4] overflow-hidden bg-[#FAFAFA]">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex flex-col gap-1 text-center">
                        <span className="font-serif text-sm md:text-base text-textPrimary truncate">{product.title}</span>
                        <span className="font-sans text-[10px] md:text-xs text-textSecondary tracking-wider">{product.price}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center font-sans text-sm tracking-widest text-textSecondary uppercase">
                No products found
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
