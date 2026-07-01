import React from 'react';

export default function GalleryCard({ data, index }) {
  return (
    <div 
      className="group relative flex-shrink-0 w-[85vw] md:w-[450px] aspect-[4/5] md:h-[650px] md:aspect-auto rounded-[24px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform hover:-translate-y-2 bg-white/40 backdrop-blur-md border border-white/60 p-3 md:p-4 will-change-transform"
    >
      <div className="w-full h-full relative rounded-[16px] overflow-hidden bg-gray-100">
        <img 
          src={data.src} 
          alt={data.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
        />
        
        {/* Subtle overlay gradient for text readability if needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Floating Info Badge - Glassmorphism */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/50 w-full flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">{data.category}</span>
            <span className="font-serif text-xl text-gray-900">{data.title}</span>
          </div>
          <span className="font-sans text-xs text-gray-400">0{index + 1}</span>
        </div>
      </div>
    </div>
  );
}
