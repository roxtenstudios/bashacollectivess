import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGES } from '../data/images';

gsap.registerPlugin(ScrollTrigger);

export default function Section13Signature() {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  // Pool of images to populate our custom grid
  const imgPool = [...IMAGES.storeProducts, ...IMAGES.storeProducts];

  useGSAP(() => {
    const getScrollAmount = () => {
      let scrollWidth = galleryRef.current.scrollWidth;
      return Math.max(0, scrollWidth - window.innerWidth);
    };

    gsap.to(galleryRef.current, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full h-screen bg-[#FAFAFA] relative overflow-hidden flex flex-col items-center justify-center border-t border-border gap-12 md:gap-16">
      
      {/* Title - Naturally positioned above the gallery */}
      <div className="z-20 flex flex-col items-center text-center w-full">
        <h2 className="font-serif text-3xl md:text-5xl text-textPrimary tracking-wide">
          The Gallery Wall
        </h2>
      </div>

      {/* Horizontal Gallery Wrapper */}
      <div className="w-full h-[50vh] md:h-[60vh]">
        {/* The sliding track */}
        <div ref={galleryRef} className="flex h-full px-6 md:px-12 gap-2 md:gap-4" style={{ width: 'max-content' }}>
          
          {/* BLOCK 1: Tall Rectangle */}
          <div className="w-[60vw] md:w-[30vw] shrink-0 h-full p-2 bg-white shadow-sm border border-border/20">
             <img src={imgPool[0]?.image} className="w-full h-full object-cover" alt="Gallery" />
          </div>

          {/* BLOCK 2: Complex Middle Grid (Matches Wireframe exactly) */}
          <div className="w-[120vw] md:w-[70vw] shrink-0 h-full flex flex-col gap-2 md:gap-4">
             {/* Top Row */}
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[1]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[2]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[3]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
             {/* Bottom Row */}
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[4]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[8] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[5]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
          </div>

          {/* BLOCK 3: Tall Rectangle */}
          <div className="w-[60vw] md:w-[30vw] shrink-0 h-full p-2 bg-white shadow-sm border border-border/20">
             <img src={imgPool[6]?.image} className="w-full h-full object-cover" alt="Gallery" />
          </div>

          {/* BLOCK 4: Mirror of the Complex Grid to keep the scroll going */}
          <div className="w-[120vw] md:w-[70vw] shrink-0 h-full flex flex-col gap-2 md:gap-4">
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[8] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[7]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[8]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[9]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[10]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={imgPool[1]?.image} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
          </div>

        </div>
      </div>

    </section>
  );
}
