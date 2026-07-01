import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../data/images';

const materials = [
  {
    id: 'linen',
    title: 'Linen',
    subtitle: 'Breathable & Textured',
    desc: 'Sourced from the finest flax, our linen offers a natural, tactile finish that softens with age.',
    image: IMAGES.materials.linen,
  },
  {
    id: 'cotton',
    title: 'Cotton',
    subtitle: 'Crisp & Pure',
    desc: 'Woven for maximum comfort, our organic cotton provides a crisp, clean structure.',
    image: IMAGES.materials.cotton,
  },
  {
    id: 'wool',
    title: 'Wool',
    subtitle: 'Warmth & Structure',
    desc: 'Ethically sourced wool delivering exceptional warmth and architectural structure.',
    image: IMAGES.materials.wool,
  }
];

export default function Section11MaterialPalette() {
  const [active, setActive] = useState('linen');

  return (
    <section className="w-full bg-bgSecondary py-24 md:py-32 px-4 md:px-12 flex flex-col gap-12">
      
      <div className="flex flex-col gap-2 items-center text-center">
        <span className="font-sans text-xs tracking-widest uppercase text-textSecondary">
          The Foundations
        </span>
        <h2 className="font-serif text-4xl md:text-5xl text-textPrimary">
          Material Palette
        </h2>
      </div>

      {/* Accordion Container - Always Horizontal (flex-row) on all devices */}
      <div className="w-full max-w-6xl mx-auto flex flex-row h-[60vh] gap-2 overflow-hidden rounded-none">
        {materials.map((mat) => {
          const isActive = active === mat.id;
          
          return (
            <motion.div
              key={mat.id}
              onClick={() => setActive(mat.id)}
              animate={{
                flex: isActive ? 4 : 1,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative cursor-pointer overflow-hidden flex flex-col justify-end group bg-black"
            >
              <motion.img 
                src={mat.image} 
                alt={mat.title}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: isActive ? 0.8 : 0.4
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              
              <div className="relative z-10 p-4 md:p-8 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  {/* Rotate text when inactive on ALL devices to fit the narrow horizontal strip */}
                  <h3 className={`font-serif text-3xl md:text-5xl text-white transition-all duration-500 whitespace-nowrap ${isActive ? 'rotate-0 translate-y-0' : '-rotate-90 origin-bottom-left -translate-y-8 translate-x-4 md:translate-x-0 md:-translate-y-0 md:origin-left'}`}>
                    {mat.title}
                  </h3>
                </div>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: 10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex flex-col gap-2 mt-2 md:mt-4 overflow-hidden"
                    >
                      <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase text-accent">
                        {mat.subtitle}
                      </span>
                      <p className="font-sans text-xs md:text-base font-light text-white/80 max-w-sm">
                        {mat.desc}
                      </p>
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
