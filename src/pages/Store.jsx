import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { IMAGES } from '../data/images';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Mock product generation up to 20 items combining available images
const sourceImages = [...IMAGES.storeProducts, ...IMAGES.lookbook];
const categories = ['Banarasi', 'Chiffon', 'Kanjeevaram', 'Silk', 'Georgette'];

export const ALL_PRODUCTS = Array.from({ length: 20 }).map((_, i) => {
  const imgSource = sourceImages[i % sourceImages.length];
  
  return {
    title: `Basha Exclusive 0${i + 1}`,
    price: parseFloat((Math.random() * 500 + 150).toFixed(2)),
    category: categories[i % categories.length],
    image: imgSource.image || imgSource.src,
    stock: 20,
    desc: 'An exquisite piece crafted with structural integrity and avant-garde sensibilities. Designed for the modern visionary.'
  };
});

export default function Store() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(location.state?.category || 'All');
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(fetchedProducts);
    });
    return () => unsubscribe();
  }, []);
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const title = p.name || p.title || '';
      const matchSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = category === 'All' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [searchTerm, category, products]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bgPrimary flex flex-col pt-0"
    >
      {/* Hero Video Section */}
      <section className="relative w-full h-[45vh] md:h-[50vh] overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Using custom store video uploaded by user */}
          <source src="/store-video.mp4" type="video/mp4" />
        </video>
        
        {/* Clear text */}
        <h1 className="relative z-20 font-serif text-5xl md:text-9xl text-white tracking-widest uppercase text-center w-full drop-shadow-xl">
          The Store
        </h1>

        {/* Seamless blend gradient into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-bgPrimary to-bgPrimary/0 z-10 pointer-events-none"></div>
      </section>

      {/* Toolbar */}
      <section className="w-full px-4 md:px-12 py-4 md:py-6 flex flex-col lg:flex-row items-center gap-6 border-b border-border/30">
        {/* Left Spacer (Invisible on mobile, pushes center items on desktop) */}
        <div className="hidden lg:block flex-1"></div>

        {/* Center: Categories */}
        <div className="flex gap-6 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 scrollbar-hide justify-start lg:justify-center shrink-0">
          {['All', ...categories].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`font-sans text-[10px] md:text-xs tracking-widest uppercase pb-2 whitespace-nowrap transition-colors ${
                category === cat ? 'border-b border-textPrimary text-textPrimary' : 'border-b border-transparent text-textSecondary hover:text-textPrimary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right: Search, Sort, Filter */}
        <div className="flex flex-1 justify-end items-stretch gap-2 lg:gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:w-48">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full bg-transparent border border-border/50 px-10 py-3 font-sans text-xs tracking-widest uppercase focus:outline-none focus:border-textPrimary transition-colors"
            />
          </div>
          
          <button onClick={() => alert("Sort functionality coming soon!")} className="flex items-center justify-center gap-2 border border-border/50 px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-colors shrink-0">
            <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase">Sort</span>
            <ChevronDown size={14} />
          </button>
          
          <button onClick={() => alert("Filter functionality coming soon!")} className="flex items-center justify-center gap-2 border border-border/50 px-4 md:px-6 py-3 hover:bg-black hover:text-white transition-colors shrink-0">
            <span className="font-sans text-[10px] md:text-xs tracking-widest uppercase">Filter</span>
            <Filter size={14} />
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full px-4 md:px-12 py-12 md:py-24">
        {/* Changed grid-cols-1 to grid-cols-2 for mobile to have 2 products per row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
          {filteredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col gap-4 cursor-pointer">
              <div className="w-full aspect-[3/4] overflow-hidden bg-[#FAFAFA]">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <div className="flex flex-col gap-1 items-center text-center">
                <h3 className="font-serif text-sm md:text-xl text-textPrimary">{product.name || product.title}</h3>
                <span className="font-sans text-[10px] md:text-sm tracking-widest text-textSecondary">₹{parseFloat(product.price).toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="w-full py-32 flex justify-center text-textSecondary font-sans tracking-widest uppercase text-sm">
            No products match your criteria.
          </div>
        )}
      </section>
    </motion.div>
  );
}
