import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { IMAGES } from '../data/images';

const VideoCard = ({ look, index }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  
  const isValidVideo = look.reel && typeof look.reel === 'string' && look.reel.trim() !== '' && !look.reel.includes('instagram.com');

  // Exclusive Playback logic & Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When highly visible, play
            if (videoRef.current && typeof videoRef.current.play === 'function') {
              videoRef.current.play().catch(e => console.log('Autoplay blocked', e));
            }
          } else {
            // Pause when out of view
            if (videoRef.current && typeof videoRef.current.pause === 'function') {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.6 } // Needs to be 60% visible to play
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
      
      // Exclusive Playback: Pause others when this one plays
      const handlePlay = (e) => {
        const allVideos = document.querySelectorAll('.shop-by-look-video');
        allVideos.forEach(v => {
          if (v !== e.target && !v.paused) {
            v.pause();
          }
        });
      };
      
      videoRef.current.addEventListener('play', handlePlay);
      
      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
          videoRef.current.removeEventListener('play', handlePlay);
        }
      };
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: 'easeOut' }}
      className="relative w-[85vw] md:w-[320px] lg:w-[380px] aspect-[9/16] rounded-[24px] overflow-hidden shrink-0 group shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 ease-out snap-center md:snap-start bg-[#F8F5F0]"
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 animate-pulse z-10"
          />
        )}
      </AnimatePresence>

      {isValidVideo ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)} // Prevent infinite loading if video fails
          className="w-full h-full object-cover relative z-0 shop-by-look-video"
        >
          <source src={look.reel} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={IMAGES.lookbook[0]?.src || "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop"} 
          alt="Fallback Video Cover"
          className="w-full h-full object-cover relative z-0"
          onLoad={() => setIsLoaded(true)}
        />
      )}
      
      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10"></div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full z-20 pointer-events-none">
        <div className="flex flex-col justify-end h-full w-full">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-2 drop-shadow-md">
            {look.productName}
          </h3>
          <span className="font-sans text-sm text-white/90 tracking-[0.1em] mb-6 drop-shadow-md uppercase">
            {look.price}
          </span>

          <div className="flex flex-col gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 ease-out translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 pointer-events-auto">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (look.productId) navigate(`/product/${look.productId}`);
              }}
              className="w-full py-4 bg-white text-textPrimary font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors rounded-sm"
            >
              Shop The Look
            </button>
            
            {look.instagramUrl && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(look.instagramUrl, '_blank');
                }}
                className="w-full py-3 bg-transparent text-white border border-white/30 font-sans text-xs tracking-[0.1em] uppercase hover:bg-white/10 transition-colors flex items-center justify-center gap-2 rounded-sm"
              >
                <ArrowUpRight size={14} /> Original Post
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Section11ShopByLook() {
  const [looks, setLooks] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.shopByLookMedia && data.shopByLookMedia.length > 0) {
          const validMedia = data.shopByLookMedia.filter(item => {
            const url = typeof item === 'string' ? item : item?.videoUrl;
            return url && typeof url === 'string' && url.trim() !== '';
          });
          
          if (validMedia.length > 0) {
            const newLooks = validMedia.map((item, idx) => {
              const url = typeof item === 'string' ? item : item.videoUrl;
              const pId = typeof item === 'string' ? '' : item.productId;
              return {
                id: idx + 1,
                reel: url,
                productName: `Style ${idx + 1}`,
                price: "View Collection",
                productId: pId || "", 
                instagramUrl: url.includes('instagram.com') ? url : "" // Still populate IG url if it's there, but video won't render
              };
            });
            setLooks(newLooks);
          } else {
            setLooks([]);
          }
        } else {
          setLooks([]);
        }
      }
    });
    return () => unsub();
  }, []);

  if (looks.length === 0) return null;

  return (
    <section className="relative w-full bg-[#F8F5F0] text-textPrimary py-20 md:py-32 flex flex-col gap-12 overflow-hidden">
      
      {/* Minimalist Header */}
      <div className="w-full px-6 flex flex-col items-center justify-center text-center">
        <span className="font-sans text-[10px] md:text-xs text-textSecondary uppercase tracking-[0.3em] mb-4">
          Community & Styling
        </span>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-textPrimary font-light">
          Shop By Look
        </h2>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div className="relative z-10 w-full px-4 md:px-12">
        <div className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 pt-4 px-[7.5vw] md:px-0 lg:max-w-[1600px] mx-auto items-center">
          {looks.map((look, idx) => (
            <VideoCard key={look.id} look={look} index={idx} />
          ))}
        </div>
      </div>

    </section>
  );
}
