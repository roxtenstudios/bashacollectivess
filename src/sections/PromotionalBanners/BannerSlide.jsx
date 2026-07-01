import React from 'react';

export default function BannerSlide({ banner }) {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] flex-shrink-0 flex items-center justify-center overflow-hidden group">
      {/* Background Image */}
      {banner.imageUrl ? (
        <img 
          src={banner.imageUrl} 
          alt="Promotional Banner" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gray-200" />
      )}
    </div>
  );
}
