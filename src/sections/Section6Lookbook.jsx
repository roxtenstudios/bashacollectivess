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

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lookbookMedia && data.lookbookMedia.length > 0) {
          const newItems = data.lookbookMedia.map((url, idx) => ({
            src: url,
            title: `Style ${idx + 1}`,
            id: idx
          }));
          setItems(newItems);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1));
    }, 3000);

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
      
      <div className="flex flex-col gap-2 items-center text-center px-6 mb-8 md:mb-12">
        <span className="font-sans text-xs tracking-[0.2em] uppercase text-textSecondary">
          Curated Styles
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-textPrimary">
          The Lookbook
        </h2>
      </div>

      <div className="relative w-full h-[55vh] md:h-[65vh] flex items-center justify-center">
        <div className="absolute w-full h-full flex justify-center items-center perspective-1000">
            {items.map((item, index) => {
              // Calculate continuous circular offset
              let offset = index - (currentIndex % items.length);
              if (offset < -Math.floor(items.length / 2)) offset += items.length;
              if (offset > Math.floor(items.length / 2)) offset -= items.length;
              
              const isCenter = offset === 0;
              const absOffset = Math.abs(offset);
              // Hide elements that are too far away (e.g. > 2)
              const isVisible = absOffset <= 2;
              
              return (
                <motion.div
                  key={item.id || index}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  initial={false}
                  animate={{
                    x: offset * (window.innerWidth < 768 ? 140 : 260), 
                    scale: isCenter ? 1 : Math.max(0.65, 1 - absOffset * 0.15),
                    zIndex: items.length - absOffset,
                    opacity: isCenter ? 1 : (isVisible ? Math.max(0.4, 1 - absOffset * 0.25) : 0),
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`absolute w-[65vw] md:w-[30vw] max-w-[400px] aspect-[4/5] cursor-grab active:cursor-grabbing pointer-events-${isVisible ? 'auto' : 'none'} bg-white p-3 md:p-4 shadow-xl border border-gray-100 ${isCenter ? 'hover:scale-[1.02] cursor-pointer shadow-2xl' : ''}`}
                  onClick={() => {
                    if (!isCenter && isVisible) {
                      setCurrentIndex(currentIndex + offset);
                    } else if (isCenter) {
                      navigate('/store');
                    }
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
