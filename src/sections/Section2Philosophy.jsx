import { motion } from 'framer-motion';
import { IMAGES } from '../data/images';

export default function Section2Philosophy() {
  return (
    <section id="about" className="w-full bg-bgPrimary py-20 px-4 md:px-8 flex flex-col gap-8">
      
      {/* Mobile Bento Layout for Philosophy */}
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
        
        {/* Text Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 bg-bgCard rounded-[24px] p-8 md:p-12 shadow-soft flex flex-col justify-center gap-6"
        >
          <span className="font-sans text-xs tracking-widest uppercase text-accent">Our Philosophy</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-textPrimary leading-tight">
            Luxury isn't loud.<br />
            <span className="italic text-textSecondary">It's remembered.</span>
          </h2>
          <p className="font-sans text-sm text-textSecondary font-light leading-relaxed max-w-sm mt-4">
            We believe in creating pieces that whisper rather than shout. Every thread is chosen with absolute intention, designed to integrate seamlessly into your life.
          </p>
        </motion.div>

        {/* Image Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full md:w-1/2 h-[50vh] md:h-auto bg-bgSecondary rounded-[24px] shadow-soft overflow-hidden relative group"
        >
          <img 
            src={IMAGES.philosophy} 
            alt="Philosophy" 
            className="w-full h-full object-cover transition-transform duration-1200 group-hover:scale-105"
          />
        </motion.div>

      </div>

    </section>
  );
}
