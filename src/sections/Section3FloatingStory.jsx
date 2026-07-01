import { motion } from 'framer-motion';
import { IMAGES } from '../data/images';

export default function Section3FloatingStory() {
  return (
    <section className="w-full bg-bgSecondary py-24 px-4 md:px-8 flex flex-col items-center">
      
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-16">
        
        <div className="text-center px-4">
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-widest text-textPrimary">
            The Editorial
          </h2>
        </div>

        {/* Layered Collage */}
        <div className="relative w-full h-[70vh] md:h-[80vh] flex items-center justify-center mt-8">
          
          {/* Back Left Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: -4 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-[5%] md:left-[15%] w-[55%] md:w-[35%] aspect-[3/4] bg-bgCard rounded-[24px] shadow-soft p-2 md:p-4 z-10"
          >
            <img src={IMAGES.floating[0]} alt="Story 1" className="w-full h-full object-cover rounded-[16px]" />
          </motion.div>

          {/* Back Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 6 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="absolute right-[5%] md:right-[15%] w-[50%] md:w-[35%] aspect-square bg-bgCard rounded-[24px] shadow-soft p-2 md:p-4 z-20 mt-32 md:mt-48"
          >
            <img src={IMAGES.floating[2]} alt="Story 3" className="w-full h-full object-cover rounded-[16px]" />
          </motion.div>

          {/* Front Center Image */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="absolute z-30 w-[65%] md:w-[40%] aspect-[4/5] bg-bgCard rounded-[24px] shadow-soft-hover p-2 md:p-4 -mt-16 md:-mt-24"
          >
            <img src={IMAGES.floating[1]} alt="Story 2" className="w-full h-full object-cover rounded-[16px]" />
            <div className="absolute bottom-6 right-6 bg-bgCard/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
              <span className="font-sans text-[10px] tracking-widest uppercase">Archive 01</span>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
