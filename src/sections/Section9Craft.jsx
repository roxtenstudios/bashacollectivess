import { useRef } from 'react';
import { IMAGES } from '../data/images';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Section9Craft() {
  return (
    <section className="w-full bg-bgPrimary py-24 md:py-32 px-4 md:px-8">
      
      {/* Massive Promotional Rounded Container */}
      <div className="w-full max-w-7xl mx-auto bg-[#E8EAE3] rounded-[32px] md:rounded-[48px] p-8 md:p-16 flex flex-col gap-12 overflow-hidden relative shadow-soft">
        
        {/* Background Decorative Element */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#DCE0D5] rounded-full mix-blend-multiply opacity-50 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8 w-full">
          
          <div className="flex flex-col gap-6 md:max-w-xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl uppercase tracking-widest text-[#2A2E26] leading-[1.1]"
            >
              Elevate Your Wardrobe With Our Latest Finds
            </motion.h2>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:max-w-xs flex flex-col gap-4"
          >
            <p className="font-sans text-sm font-light text-[#4A4E46] leading-relaxed">
              Discover how mindfulness and premium fabrics combine to create your signature style at Basha Collectives.
            </p>
            <Link to="/store" className="inline-block text-center mt-4 bg-[#2A2E26] text-white rounded-full py-3 px-6 font-sans text-xs tracking-widest uppercase hover:bg-black transition-colors duration-300">
              Explore Collection
            </Link>
          </motion.div>

        </div>

        {/* Large Media Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative z-10 w-full h-[50vh] md:h-[70vh] rounded-[24px] overflow-hidden shadow-soft-hover group cursor-pointer"
        >
          <img 
            src={IMAGES.craft} 
            alt="Campaign Feature" 
            className="w-full h-full object-cover transition-transform duration-1200 ease-lux group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-700"></div>
          
          {/* Faux Play Button / Interaction Circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
          
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-[#2A2E26]">
            <span className="w-2 h-2 rounded-full bg-[#2A2E26] animate-pulse"></span>
            <span className="font-sans text-xs tracking-widest uppercase">Our New Collection Introduction</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
