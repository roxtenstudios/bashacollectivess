import Section1Hero from '../sections/Section1Hero';
import Section2Philosophy from '../sections/Section2Philosophy';
import Section4Quote from '../sections/Section4Quote';
import Section5Collection from '../sections/Section5Collection';
import Section6Lookbook from '../sections/Section6Lookbook';
import Section7Marquee from '../sections/Section7Marquee';
import PromotionalBannerCarousel from '../sections/PromotionalBanners/PromotionalBannerCarousel';
import Section8Featured from '../sections/Section8Featured';
import Section9Craft from '../sections/Section9Craft';
import Section10Exclusive from '../sections/Section10Exclusive';
import Section11ShopByLook from '../sections/Section11ShopByLook';
import GalleryWall from '../sections/GalleryWall/GalleryWall';
import Section12Newsletter from '../sections/Section12Newsletter';

export default function Home() {
  return (
    <main className="w-full block bg-bgPrimary">
      <Section1Hero />
      <Section2Philosophy />
      <Section4Quote />
      <Section5Collection />
      <Section7Marquee />
      <PromotionalBannerCarousel />
      <Section6Lookbook />
      <Section8Featured />
      <Section10Exclusive />
      <Section11ShopByLook />
      <GalleryWall />
      <Section12Newsletter />
    </main>
  );
}
