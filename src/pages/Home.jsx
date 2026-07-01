import Section1Hero from '../sections/Section1Hero';
import Section2Philosophy from '../sections/Section2Philosophy';
import Section4Quote from '../sections/Section4Quote';
import Section5Collection from '../sections/Section5Collection';
import Section6Lookbook from '../sections/Section6Lookbook';
import Section7Marquee from '../sections/Section7Marquee';
import Section8Featured from '../sections/Section8Featured';
import Section9Craft from '../sections/Section9Craft';
import Section10Exclusive from '../sections/Section10Exclusive';
import Section11ShopByLook from '../sections/Section11ShopByLook';
import Section12Newsletter from '../sections/Section12Newsletter';
import Section13Signature from '../sections/Section13Signature';

export default function Home() {
  return (
    <main className="w-full block bg-bgPrimary">
      <Section1Hero />
      <Section2Philosophy />
      <Section4Quote />
      <Section5Collection />
      <Section7Marquee />
      <Section6Lookbook />
      <Section8Featured />
      <Section10Exclusive />
      <Section11ShopByLook />
      <Section12Newsletter />
      <Section13Signature />
    </main>
  );
}
