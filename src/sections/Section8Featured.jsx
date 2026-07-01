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
  
  // Use exactly the products fetched, but add uniqueId for rendering
  const allPieces = featured.map((p, i) => ({ ...p, uniqueId: `${p.id}-${i}` }));

  return (
    <section id="bestsellers" className="w-full bg-[#FAF9F6] py-24 md:py-32 flex flex-col gap-16 overflow-hidden border-t border-gray-100">
      
      <div className="flex flex-col items-center text-center px-6 gap-6 z-10">
        <div className="flex items-center gap-6 w-full max-w-md justify-center">
          <div className="h-[1px] bg-[#D4AF37] w-16 opacity-50"></div>
          <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D4AF37] whitespace-nowrap">
            The Icons
          </span>
          <div className="h-[1px] bg-[#D4AF37] w-16 opacity-50"></div>
        </div>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide text-gray-900 font-light">
          Best Sellers
        </h2>
        <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto tracking-wide">
          Our most coveted pieces, loved by many. Explore the signature styles that define our collection.
        </p>
      </div>

      <div className="w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide flex items-center px-6 md:px-12 pb-16 pt-8">
        <div className="flex gap-8 md:gap-16 w-max items-start pr-6 md:pr-12 lg:mx-auto">
          {allPieces.map((piece, i) => (
            <motion.div 
              key={piece.uniqueId}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => navigate(`/product/${piece.id}`)}
              className="group cursor-pointer flex flex-col shrink-0 snap-center w-[85vw] md:w-[360px] relative"
            >
              {/* Giant Rank Number */}
              <div className="absolute -left-6 -top-12 md:-left-10 md:-top-16 font-serif text-[120px] md:text-[160px] text-gray-100 font-bold z-0 pointer-events-none select-none tracking-tighter">
                {(i + 1).toString().padStart(2, '0')}
              </div>

              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 z-10 shadow-sm transition-shadow duration-500 group-hover:shadow-2xl rounded-sm">
                <img 
                  src={piece.image} 
                  alt={piece.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="bg-white text-black px-8 py-3 text-xs tracking-widest uppercase font-medium shadow-lg rounded-sm">
                      Discover
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-center text-center w-full gap-3 mt-8 z-10 px-4">
                <h3 className="font-serif text-xl md:text-2xl text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {piece.title}
                </h3>
                <div className="flex flex-col items-center gap-1 font-sans">
                  <span className="text-gray-900 text-sm tracking-widest font-medium">{piece.price}</span>
                  {piece.oldPrice && (
                    <span className="text-gray-400 text-xs line-through tracking-wider">{piece.oldPrice}</span>
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
