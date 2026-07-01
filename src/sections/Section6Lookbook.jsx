import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data/images';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Section6Lookbook() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState(IMAGES.lookbook);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  // Auto scroll every 2 seconds
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newItems = [...IMAGES.lookbook]; // Base fallback
        
        for (let i = 1; i <= 5; i++) {
          const url = data[`lookbook${i}`];
          if (url && url.trim() !== '') {
            newItems[i - 1] = { ...newItems[i - 1], src: url };
          }
        }
        setItems(newItems);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1));
    }, 2000);

    return () => resetTimeout();
  }, [currentIndex, items]);

  const handleDragEnd = (e, { offset }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      setCurrentIndex(currentIndex + 1);
    } else if (swipe > 50) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section id="lookbook" className="w-full bg-bgPrimary pt-24 md:pt-32 pb-12 flex flex-col items-center overflow-hidden">
      
      <div className="flex flex-col gap-2 items-center text-center px-6 mb-6">
        <span className="font-sans text-xs tracking-[0.2em] uppercase text-textSecondary">
          Curated Styles
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-textPrimary">
          The Lookbook
        </h2>
      </div>

      <div className="relative w-full h-[55vh] md:h-[65vh] -mt-8 flex items-center justify-center">
        
        <div className="absolute w-full h-full flex justify-center items-center perspective-1000">
          <AnimatePresence initial={false}>
            {/* Render 5 items: center, 2 left, 2 right to simulate infinite loop */}
            {[-2, -1, 0, 1, 2].map((offset) => {
              
              // Map continuous index to array bounds for circular array
              const absoluteIndex = currentIndex + offset;
              const mappedIndex = ((absoluteIndex % items.length) + items.length) % items.length;
              const item = items[mappedIndex];
              const isCenter = offset === 0;
              
              return (
                <motion.div
                  key={absoluteIndex} // Use absolute index for infinite forward/backward animation
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  animate={{
                    // Increased offset multiplier to prevent collision
                    x: offset * (window.innerWidth < 768 ? 160 : 300), 
                    scale: isCenter ? 1 : 0.8, // Slightly bigger side items for better visibility
                    zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                    opacity: isCenter ? 1 : (Math.abs(offset) === 1 ? 0.7 : 0.3), // Clearer opacity stepping
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-[65vw] md:w-[30vw] aspect-[3/4] cursor-grab active:cursor-grabbing
                    ${isCenter ? 'bg-white p-3 md:p-4 shadow-2xl border-[8px] md:border-[12px] border-white cursor-pointer hover:scale-[1.02] transition-transform' : 'bg-transparent shadow-md'}
                  `}
                  onClick={() => {
                    if (!isCenter) setCurrentIndex(currentIndex + offset);
                    else navigate('/store');
                  }}
                >
                  <div className="w-full h-full overflow-hidden bg-bgSecondary">
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      <div className="mt-4 text-center h-[50px] relative w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={((currentIndex % items.length) + items.length) % items.length}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute flex flex-col items-center"
          >
            <span className="font-serif text-2xl italic text-textSecondary">
              {items[((currentIndex % items.length) + items.length) % items.length]?.title}
            </span>
            <div className="w-8 h-[1px] bg-accent mt-4"></div>
          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  );
}
