import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getBanners } from '../../services/bannerService';
import BannerSlide from './BannerSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PromotionalBannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Initialize Embla Carousel with Autoplay (5s)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  ]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const activeBanners = await getBanners(true);
        setBanners(activeBanners);
      } catch (error) {
        console.error("Failed to load banners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full relative group bg-bgPrimary">
      <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
            {banners.map((banner, index) => (
              <div className="flex-[0_0_100%] min-w-0 pl-0 relative" key={banner.id}>
                <BannerSlide banner={banner} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows (Visible on Desktop Hover) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
              aria-label="Previous Banner"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto"
              aria-label="Next Banner"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto ${
                    idx === selectedIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

    </section>
  );
}
