import { useState, useEffect } from 'react';
import { IMAGES } from '../data/images';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function Section8Featured() {
  const [featured, setFeatured] = useState(IMAGES.featured);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'products'), where('isBestSeller', '==', true));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const products = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            image: data.image,
            title: data.name,
            price: `₹${data.price.toFixed(2)}`,
            oldPrice: null // Can add oldPrice logic later if needed
          };
        });
        setFeatured(products.length > 0 ? products : IMAGES.featured);
      }
    });
    return () => unsub();
  }, []);
  
  // Combine to make a longer carousel for demo
  const allPieces = [...featured, ...featured, ...featured].map((p, i) => ({ ...p, uniqueId: `${p.id}-${i}` }));

  return (
    <section id="bestsellers" className="w-full bg-bgPrimary py-16 md:py-24 flex flex-col gap-12 overflow-hidden">
      
      <div className="flex flex-col items-center text-center px-6 gap-6">
        <div className="flex items-center gap-4 w-full max-w-sm justify-center">
          <div className="h-[1px] bg-textPrimary w-12 opacity-30"></div>
          <span className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-textSecondary whitespace-nowrap">
            Trending Sarees
          </span>
          <div className="h-[1px] bg-textPrimary w-12 opacity-30"></div>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-textPrimary">
          Best Sellers
        </h2>
      </div>

      <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide flex items-center px-6 md:px-12 pb-8 pt-4">
        <div className="flex gap-6 md:gap-12 w-max items-start pr-6 md:pr-12 lg:mx-auto">
          {allPieces.map((piece, i) => (
            <motion.div 
              key={piece.uniqueId}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: 'easeOut' }}
              onClick={() => navigate(`/product/${piece.id}`)}
              className="group cursor-pointer flex flex-col shrink-0 snap-center w-[80vw] md:w-[400px]"
            >
              <div className="w-full aspect-[2/3] overflow-hidden bg-bgSecondary mb-6">
                <img 
                  src={piece.image} 
                  alt={piece.title} 
                  className="w-full h-full object-cover transition-transform duration-1200 ease-lux group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col items-center text-center w-full gap-3 px-2">
                <h3 className="font-serif text-2xl md:text-3xl text-textPrimary leading-tight">
                  {piece.title}
                </h3>
                <div className="flex items-center justify-center gap-4 font-serif text-base md:text-lg">
                  <span className="text-textPrimary tracking-wider">{piece.price}</span>
                  {piece.oldPrice && (
                    <span className="text-textSecondary/50 line-through tracking-wider">{piece.oldPrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
