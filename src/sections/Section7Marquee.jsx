import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = [
  "QUALITY",
  "CRAFT",
  "DETAIL",
  "SIMPLICITY",
  "TIMELESSNESS",
  "ELEGANCE"
];

export default function Section7Marquee() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full bg-[#FAF9F6] py-32 md:py-48 flex flex-col justify-center items-center overflow-hidden border-y border-border/30 px-4">
      
      {/* Background Watermark (Outline Typography) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span 
          className="text-[180px] md:text-[300px] lg:text-[450px] tracking-tighter leading-none text-transparent select-none whitespace-nowrap"
          style={{ fontFamily: "'Anton', sans-serif", WebkitTextStroke: '2px rgba(0,0,0,0.05)' }}
        >
          BASHA
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
        {/* Top static text */}
        <span className="font-serif text-2xl md:text-3xl lg:text-4xl text-[#C5A059] mb-8 md:mb-10 tracking-[0.2em] uppercase">
          BASHA'S
        </span>
        
        {/* Rotating word container */}
        <div className="relative h-[80px] md:h-[130px] lg:h-[150px] w-full flex justify-center items-center mb-8 md:mb-10 overflow-hidden">
          <AnimatePresence>
            <motion.span
              key={words[index]}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute font-serif text-[50px] md:text-[90px] lg:text-[120px] font-medium tracking-tight text-textPrimary leading-none"
            >
              {words[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Bottom static text */}
        <span className="font-sans text-xs md:text-sm font-light tracking-[0.2em] text-textSecondary uppercase">
          is never accidental.
        </span>
      </div>

    </section>
  );
}
