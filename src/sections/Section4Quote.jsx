import { motion } from 'framer-motion';
import { IMAGES } from '../data/images';

export default function Section4Quote() {
  return (
    <section 
      className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center px-6 overflow-hidden bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${IMAGES.floating[0]})` }}
    >
      {/* Luxurious Cream Overlay with reduced opacity so image is visible */}
      <div className="absolute inset-0 bg-[#F9F6F0]/50 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center gap-8"
      >
        <div className="flex items-center gap-4 w-full justify-center opacity-70">
          <div className="h-[1px] bg-textPrimary w-12"></div>
          <span className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-textPrimary whitespace-nowrap">
            The Vision
          </span>
          <div className="h-[1px] bg-textPrimary w-12"></div>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-textPrimary tracking-wide">
          Less Trend.<br />
          <span className="italic opacity-80">More Legacy.</span>
        </h2>
      </motion.div>
    </section>
  );
}
