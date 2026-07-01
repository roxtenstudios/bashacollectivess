import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGES } from '../data/images';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

gsap.registerPlugin(ScrollTrigger);

export default function Section13Signature() {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);
  const [media, setMedia] = useState([...IMAGES.storeProducts.map(p => p.image)]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'homepage'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.galleryWallMedia && data.galleryWallMedia.length > 0) {
          setMedia(data.galleryWallMedia);
        }
      }
    });
    return () => unsub();
  }, []);

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
  }, { scope: containerRef, dependencies: [media] });

  // Group media into repeating layout pattern: [1, 5, 1, 5]
  const renderBlocks = () => {
    let blocks = [];
    let i = 0;
    let blockIndex = 0;
    
    // If not enough media to make it look good, duplicate it
    let workingMedia = [...media];
    if (workingMedia.length < 11) {
       workingMedia = [...workingMedia, ...workingMedia, ...workingMedia].slice(0, 11);
    }

    while (i < workingMedia.length) {
      const type = blockIndex % 4;

      if (type === 0 || type === 2) {
        // Tall Rectangle
        blocks.push(
          <div key={i} className="w-[60vw] md:w-[30vw] shrink-0 h-full p-2 bg-white shadow-sm border border-border/20">
            <img src={workingMedia[i]} className="w-full h-full object-cover" alt="Gallery" />
          </div>
        );
        i += 1;
      } else if (type === 1) {
        // Complex Grid 1
        blocks.push(
          <div key={i} className="w-[120vw] md:w-[70vw] shrink-0 h-full flex flex-col gap-2 md:gap-4">
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+1] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+2] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+3] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[8] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+4] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
          </div>
        );
        i += 5;
      } else if (type === 3) {
        // Complex Grid 2 (Mirror)
        blocks.push(
          <div key={i} className="w-[120vw] md:w-[70vw] shrink-0 h-full flex flex-col gap-2 md:gap-4">
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[8] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+1] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
             <div className="flex h-[50%] gap-2 md:gap-4">
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+2] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[3] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+3] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
                <div className="flex-[4] p-2 bg-white shadow-sm border border-border/20">
                   <img src={workingMedia[i+4] || workingMedia[0]} className="w-full h-full object-cover" alt="Gallery" />
                </div>
             </div>
          </div>
        );
        i += 5;
      }
      blockIndex++;
    }
    return blocks;
  };

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
          {renderBlocks()}
        </div>
      </div>
    </section>
  );
}
