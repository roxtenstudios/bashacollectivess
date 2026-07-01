import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const LOOKS = [
  {
    id: 1,
    reel: "/reel1.mp4",
    productName: "Signature Banarasi",
    price: "₹24,500",
    productId: "1",
    instagramUrl: "https://www.instagram.com/reel/DZrSkteRwS0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  }
];

const VideoCard = ({ look, index }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (videoRef.current && typeof videoRef.current.play === 'function') {
                videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
              }
            }, 100);
          } else {
            if (videoRef.current && typeof videoRef.current.pause === 'function') {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: 'easeOut' }}
      className="relative w-[70vw] lg:w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden shrink-0 group shadow-soft hover:shadow-soft-hover hover:scale-[1.02] transition-all duration-700 ease-lux"
    >
      <video
        ref={videoRef}
        src={look.reel}
        loop
        muted
        playsInline
        className="w-full h-full object-cover relative z-0 bg-bgSecondary"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10"></div>

      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full z-20 pointer-events-none">
        <div className="flex flex-col justify-end h-full w-full">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-1 drop-shadow-md">
            {look.productName}
          </h3>
          <span className="font-sans text-sm text-white/90 tracking-widest mb-6 drop-shadow-md">
            {look.price}
          </span>

          <div className="flex flex-col gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 ease-out translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 pointer-events-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (look.productId) navigate(`/product/${look.productId}`);
              }}
              className="w-full py-4 bg-white text-textPrimary font-sans text-xs tracking-[0.2em] uppercase hover:bg-bgPrimary transition-colors"
            >
              Buy Now
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (look.instagramUrl) window.open(look.instagramUrl, '_blank');
              }}
              className="w-full py-4 bg-black/40 backdrop-blur-md text-white border border-white/20 font-sans text-xs tracking-[0.2em] uppercase hover:bg-black/60 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight size={14} /> View on Instagram
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Section11ShopByLook() {
  const [looks, setLooks] = useState(LOOKS);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.shopByLookMedia && data.shopByLookMedia.length > 0) {
          const newLooks = data.shopByLookMedia.map((url, idx) => ({
            id: idx + 1,
            reel: url,
            productName: `Look ${idx + 1}`,
            price: "View Details",
            productId: "", // Ideally we link this in a more advanced admin, for now just empty
            instagramUrl: ""
          }));
          setLooks(newLooks);
        }
      }
    });
    return () => unsub();
  }, []);
  return (
    <section className="relative w-full bg-bgPrimary text-textPrimary py-16 md:py-24 flex flex-col gap-8 overflow-hidden">
      
      {/* Super Minimalist Header */}
      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-textPrimary uppercase tracking-[0.1em] font-light mb-4">
          Shop By Look
        </h2>
        <p className="font-sans text-[10px] md:text-xs text-textSecondary uppercase tracking-[0.3em] max-w-md mx-auto leading-relaxed">
          Community Styles
        </p>
      </div>

      {/* Container: Horizontal snap on mobile, Grid on tablet/desktop */}
      <div className="relative z-10 w-full mt-4">
        <div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-12 pt-4 px-[15vw] lg:px-12 items-start w-full lg:max-w-7xl lg:mx-auto">
          {looks.map((look, idx) => (
            <div 
              key={look.id} 
              className="snap-center shrink-0"
            >
              <VideoCard look={look} index={idx} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
