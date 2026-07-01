import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GalleryCard from './GalleryCard';
import { galleryData } from '../../data/galleryData';

gsap.registerPlugin(ScrollTrigger);

const extendedData = [...galleryData, ...galleryData]; // Duplicate for a longer gallery

const TallBlock = ({ item }) => (
  <div className="h-full w-[60vw] md:w-[30vw] shrink-0 p-1 md:p-2">
    <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
      <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  </div>
);

const Column1 = ({ items }) => (
  <div className="h-full w-[85vw] md:w-[45vw] shrink-0 flex flex-col p-1 md:p-2">
    <div className="flex h-1/2 w-full pb-1 md:pb-2">
      <div className="flex-[4] pr-1 md:pr-2 h-full">
        <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
          <img src={items[0]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
      <div className="flex-[2] pl-1 md:pl-2 h-full">
        <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
          <img src={items[1]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
    </div>
    <div className="h-1/2 w-full pt-1 md:pt-2">
      <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
        <img src={items[2]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    </div>
  </div>
);

const Column2 = ({ items }) => (
  <div className="h-full w-[85vw] md:w-[45vw] shrink-0 flex flex-col p-1 md:p-2">
    <div className="h-1/2 w-full pb-1 md:pb-2">
      <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
        <img src={items[0]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    </div>
    <div className="flex h-1/2 w-full pt-1 md:pt-2">
      <div className="flex-[2] pr-1 md:pr-2 h-full">
        <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
          <img src={items[1]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
      <div className="flex-[4] pl-1 md:pl-2 h-full">
        <div className="w-full h-full relative group overflow-hidden border border-white shadow-sm bg-gray-100">
          <img src={items[2]?.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      </div>
    </div>
  </div>
);

export default function GalleryWall() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const renderBlocks = () => {
    const elements = [];
    let i = 0;
    let keyIdx = 0;
    
    while (i < extendedData.length) {
      if (i < extendedData.length) {
        elements.push(<TallBlock key={`b-${keyIdx++}`} item={extendedData[i]} />);
        i += 1;
      }
      
      if (i + 2 < extendedData.length) {
        elements.push(<Column1 key={`b-${keyIdx++}`} items={[extendedData[i], extendedData[i+1], extendedData[i+2]]} />);
        i += 3;
      } else break;
      
      if (i + 2 < extendedData.length) {
        elements.push(<Column2 key={`b-${keyIdx++}`} items={[extendedData[i], extendedData[i+1], extendedData[i+2]]} />);
        i += 3;
      } else break;
    }
    return elements;
  };

  useGSAP(() => {
    if (!trackRef.current || !sectionRef.current) return;

    let ctx = gsap.context(() => {
      
      const getScrollAmount = () => {
        if (!trackRef.current) return 0;
        
        let totalWidth = 0;
        const children = Array.from(trackRef.current.children);
        
        if (children.length === 0) return 0;

        children.forEach(child => {
          totalWidth += child.offsetWidth;
        });

        // Add outer padding (px-6 is 24px, px-12 is 48px)
        const isMobile = window.innerWidth < 768;
        const padding = isMobile ? 48 : 96;
        totalWidth += padding;

        trackRef.current.style.width = `${totalWidth}px`;

        return Math.max(0, totalWidth - window.innerWidth);
      };

      gsap.to(trackRef.current, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
          }
        }
      });
      
      // Fix for overlapping sections: GSAP needs to recalculate pin positions 
      // if any sections above it load dynamically (like Firebase fetching)
      const observer = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      observer.observe(document.body);
      
      return () => observer.disconnect();
      
    }, sectionRef);
    
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <div className="w-full relative">
      <section ref={sectionRef} className="w-full h-[100svh] bg-[#F9F9F9] relative flex flex-col justify-center overflow-hidden border-t border-gray-200">
      
      {/* Title */}
      <div className="w-full flex justify-center items-center z-20 pointer-events-none mb-6 md:mb-10">
        <h2 className="font-serif text-3xl md:text-5xl text-gray-900 tracking-wide text-center">
          The Gallery Wall
        </h2>
      </div>

      {/* Track Wrapper */}
      <div className="w-full flex items-center">
        <div 
          ref={trackRef}
          className="flex h-[55vh] md:h-[60vh] px-6 md:px-12 items-center will-change-transform"
        >
          {renderBlocks()}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 z-20 flex items-center justify-between pointer-events-none">
        <span className="font-sans text-[10px] md:text-xs text-gray-400 tracking-widest">01</span>
        
        <div className="flex-1 mx-4 md:mx-8 h-[1px] bg-gray-200 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gray-900 transition-all duration-75 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        
        <span className="font-sans text-[10px] md:text-xs text-gray-400 tracking-widest">END</span>
      </div>

      </section>
    </div>
  );
}
