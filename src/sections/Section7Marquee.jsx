import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Section7Marquee() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const content = marqueeRef.current.firstElementChild;
      const moveDistance = content.offsetWidth;

      gsap.to(marqueeRef.current, {
        x: -moveDistance,
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const textGroup = (
    <div className="flex gap-16 md:gap-32 px-8 md:px-16 items-center whitespace-nowrap">
      <span>BASHA COLLECTIVES</span>
      <span className="text-accent text-3xl md:text-5xl">&bull;</span>
      <span>QUALITY</span>
      <span className="text-accent text-3xl md:text-5xl">&bull;</span>
      <span>MINIMALISM</span>
      <span className="text-accent text-3xl md:text-5xl">&bull;</span>
      <span>TIMELESS</span>
      <span className="text-accent text-3xl md:text-5xl">&bull;</span>
    </div>
  );

  return (
    <section className="w-full bg-bgPrimary py-24 md:py-32 overflow-hidden flex items-center">
      <div ref={marqueeRef} className="flex font-serif text-3xl md:text-5xl lg:text-6xl tracking-wider text-textPrimary">
        {textGroup}
        {textGroup}
        {textGroup}
      </div>
    </section>
  );
}
