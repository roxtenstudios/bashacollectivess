import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Section1Hero() {
  const [content, setContent] = useState({
    heroVideo: '/hero-video.mp4',
    heroTitle: 'Basha Collectives'
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.heroVideo || data.heroTitle) {
          setContent(prev => ({
            ...prev,
            heroVideo: data.heroVideo || prev.heroVideo,
            heroTitle: data.heroTitle || prev.heroTitle
          }));
        }
      }
    });
    return () => unsub();
  }, []);

  const handleScrollToStore = () => {
    const storeSection = document.getElementById('collection');
    if (storeSection) {
      window.scrollTo({ top: storeSection.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          {/* Using dynamic video from Firebase or local fallback */}
          <source src={content.heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-8 gap-6 md:gap-8 w-full max-w-screen-xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="flex flex-col gap-3 md:gap-4 w-full"
        >
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-widest uppercase break-words w-full px-2">
            {content.heroTitle}
          </h1>
          <p className="font-sans font-light text-[10px] sm:text-xs md:text-lg text-white/80 tracking-widest uppercase">
            The Modern Avant-Garde
          </p>
        </motion.div>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          onClick={handleScrollToStore}
          className="mt-6 md:mt-8 px-6 py-3 md:px-10 md:py-4 border border-white/70 text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-500 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase rounded-none backdrop-blur-sm"
        >
          Explore Collection
        </motion.button>
      </div>

    </section>
  );
}
