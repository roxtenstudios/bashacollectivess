import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data/images';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Section10Exclusive() {
  const [active, setActive] = useState(IMAGES.storeProducts[0].id);
  const [exclusives, setExclusives] = useState(IMAGES.storeProducts.slice(0, 4));
  const navigate = useNavigate();
  
  useEffect(() => {
    const q = query(collection(db, 'products'), where('isExclusive', '==', true));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            category: data.category,
            image: data.image,
            title: data.name,
            price: `₹${data.price.toFixed(2)}`
          };
        });
        if (products.length > 0) {
          setExclusives(products.slice(0, 4)); // Get up to 4
          setActive(products[0].id);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="exclusive" className="w-full bg-bgSecondary py-24 md:py-32 px-4 md:px-12 flex flex-col gap-12">
      
      <div className="flex flex-col gap-2 items-center text-center">
        <span className="font-sans text-xs tracking-widest uppercase text-textSecondary">
          Curated For You
        </span>
        <h2 className="font-serif text-2xl md:text-3xl text-textPrimary uppercase tracking-widest">
          Top Exclusive
        </h2>
      </div>

      {/* Accordion Container - Always Horizontal (flex-row) on all devices */}
      <div className="w-full max-w-7xl mx-auto flex flex-row h-[60vh] gap-2 overflow-hidden rounded-none">
        {exclusives.map((product) => {
          const isActive = active === product.id;
          
          return (
            <motion.div
              key={product.id}
              onClick={() => setActive(product.id)}
              animate={{
                flex: isActive ? 4 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative cursor-pointer overflow-hidden flex flex-col justify-end group bg-black"
            >
              <motion.img 
                src={product.image} 
                alt={product.title}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: isActive ? 0.9 : 0.4
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none"></div>
              
              <div className="relative z-10 p-4 md:p-8 flex flex-col justify-end h-full w-full">
                  {!isActive && (
                    <div className="absolute bottom-6 left-4 md:left-8 pointer-events-none">
                      <h3 className="font-serif text-sm md:text-base text-white -rotate-90 origin-bottom-left -translate-y-2 whitespace-nowrap opacity-80">
                        {product.title}
                      </h3>
                    </div>
                  )}
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4 mt-auto w-full"
                    >
                      <div className="flex flex-col gap-1 md:gap-2">
                        <h3 className="font-serif text-xl md:text-3xl text-white leading-tight break-words">
                          {product.title}
                        </h3>
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-accent">
                            {product.category}
                          </span>
                          <span className="font-sans text-sm md:text-base tracking-widest text-white/90">
                            {product.price}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="w-full md:w-fit px-6 py-3 bg-white text-textPrimary font-sans text-xs tracking-widest uppercase hover:bg-bgPrimary transition-colors mt-2 text-center"
                      >
                        Explore Piece
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
