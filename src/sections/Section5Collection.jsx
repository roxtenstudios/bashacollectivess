import { useState, useEffect } from 'react';
import { IMAGES } from '../data/images';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Section5Collection() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          title: data.name,
          price: `₹${parseFloat(data.price).toFixed(2)}`
        };
      });
      setProducts(fetchedProducts);
    });

    const qCats = query(collection(db, 'categories'), orderBy('timestamp', 'desc'));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      const cats = snapshot.docs.map(doc => doc.data().name);
      setCategories(cats);
    });

    return () => {
      unsubscribe();
      unsubCats();
    };
  }, []);

  const tabs = [
    { id: 'all', label: 'ALL' },
    ...categories.map(cat => ({ id: cat.toLowerCase(), label: cat.toUpperCase() }))
  ];

  const filteredProducts = products.filter(p => {
    const matchesTab = activeTab === 'all' || (p.category && p.category.toLowerCase() === activeTab.toLowerCase());
    const matchesSearch = p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  }).slice(0, 8); // Show only top 8 on the homepage

  return (
    <section id="collection" className="w-full bg-white py-24 md:py-32 flex flex-col gap-16 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center px-6 gap-4">
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-textSecondary">
          Discover
        </span>
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-textPrimary">
          The Main Store
        </h2>
        
        {/* Search Bar */}
        <div className="w-full max-w-md mt-4 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bgSecondary border border-border/50 text-textPrimary font-sans text-sm md:text-base px-6 py-3 rounded-full focus:outline-none focus:border-textPrimary transition-colors placeholder:text-textSecondary/50"
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full px-4 overflow-x-auto no-scrollbar">
        <div className="flex justify-start md:justify-center items-center gap-8 md:gap-12 w-max mx-auto px-4 border-b border-border/50 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 font-sans text-xs tracking-widest uppercase transition-colors duration-300 ${
                activeTab === tab.id ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-textPrimary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          layout
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12"
        >
          <AnimatePresence>
            {filteredProducts.map((piece) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                key={piece.id}
                onClick={() => navigate(`/product/${piece.id}`)}
                className="flex flex-col gap-6 group cursor-pointer"
              >
                <div className="w-full aspect-[2/3] overflow-hidden bg-bgSecondary">
                  <img 
                    src={piece.image} 
                    alt={piece.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 ease-lux group-hover:scale-105"
                  />
                </div>
                
                <div className="flex flex-col items-center text-center gap-1 w-full px-2">
                  <h3 className="font-serif text-sm md:text-lg text-textPrimary leading-tight truncate w-full">
                    {piece.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 font-serif text-xs md:text-sm">
                    <span className="text-textPrimary tracking-wider">{piece.price}</span>
                    {piece.oldPrice && (
                      <span className="text-textSecondary/50 line-through tracking-wider">{piece.oldPrice}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Explore Button */}
      <div className="w-full flex justify-center mt-4">
        <Link 
          to="/store"
          className="bg-textPrimary text-bgPrimary px-8 py-4 rounded-full font-sans text-xs uppercase tracking-widest hover:bg-black transition-colors"
        >
          Explore The Whole Store
        </Link>
      </div>
    </section>
  );
}
