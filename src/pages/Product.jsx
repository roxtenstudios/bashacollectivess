import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, RefreshCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from './Store';
import { IMAGES } from '../data/images';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [customSize, setCustomSize] = useState({
    chest: '', waist: '', hip: '', shoulder: '', height: '', notes: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            ...data,
            title: data.name || data.title,
            price: `₹${parseFloat(data.price).toFixed(2)}`,
            desc: data.desc || 'An exquisite piece crafted with structural integrity and avant-garde sensibilities.'
          });
          setActiveImage(data.images?.[0] || data.image);
          return;
        }
      } catch (err) {
        console.error("Error fetching product from Firebase:", err);
      }
      
      // Fallback to local data
      const allAvailable = [
        ...ALL_PRODUCTS,
        ...IMAGES.storeProducts,
        ...IMAGES.featured
      ];
      const found = allAvailable.find(p => String(p.id) === id);
      if (found) {
        setProduct({
          ...found,
          title: found.title || found.name,
          image: found.image || found.src,
          images: found.images || (found.image ? [found.image] : [found.src]),
          category: found.category || 'Featured',
          price: typeof found.price === 'number' ? `₹${found.price.toFixed(2)}` : String(found.price).replace('$', '₹'),
          desc: found.desc || 'An exquisite piece crafted with structural integrity and avant-garde sensibilities. Designed for the modern visionary.'
        });
        setActiveImage(found.images?.[0] || found.image || found.src);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-bgPrimary">
        <span className="font-sans tracking-widest uppercase">Loading...</span>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, size, size === 'Customize My Size' ? customSize : null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bgPrimary pt-32 pb-24 px-6 md:px-12"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-textSecondary hover:text-textPrimary transition-colors mb-12"
      >
        <ArrowLeft size={16} />
        <span className="font-sans text-xs tracking-widest uppercase">Back to Store</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        {/* Product Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] bg-[#FAFAFA]">
            <img 
              src={activeImage || product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)} 
                  className={`w-20 md:w-24 aspect-[3/4] flex-shrink-0 border-2 transition-colors ${activeImage === img ? 'border-textPrimary' : 'border-transparent'}`}
                >
                  <img src={img} alt={`${product.title} - view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <span className="font-sans text-xs tracking-widest uppercase text-textSecondary mb-4">
            {product.category}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-textPrimary mb-6">
            {product.title}
          </h1>
          <p className="font-sans text-lg tracking-widest text-textPrimary mb-12">
            {product.price}
          </p>

          <p className="font-sans text-sm md:text-base text-textSecondary leading-relaxed mb-12 max-w-md">
            {product.desc}
          </p>

          {/* Size Selector */}
          <div className="flex flex-col gap-4 mb-10">
            <span className="font-sans text-xs tracking-widest uppercase text-textPrimary">Size</span>
            <div className="flex flex-wrap gap-4">
              {['XS', 'S', 'M', 'L', 'XL', 'Customize My Size'].map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-12 flex items-center justify-center border font-sans text-xs transition-colors ${s === 'Customize My Size' ? 'px-6' : 'w-12'} ${
                    size === s ? 'border-textPrimary bg-textPrimary text-white' : 'border-border text-textSecondary hover:border-textPrimary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {size === 'Customize My Size' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Chest (inches)" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary" value={customSize.chest} onChange={e => setCustomSize({...customSize, chest: e.target.value})} />
                    <input type="text" placeholder="Waist (inches)" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary" value={customSize.waist} onChange={e => setCustomSize({...customSize, waist: e.target.value})} />
                    <input type="text" placeholder="Hip (inches)" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary" value={customSize.hip} onChange={e => setCustomSize({...customSize, hip: e.target.value})} />
                    <input type="text" placeholder="Shoulder (inches)" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary" value={customSize.shoulder} onChange={e => setCustomSize({...customSize, shoulder: e.target.value})} />
                    <input type="text" placeholder="Height" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary col-span-2" value={customSize.height} onChange={e => setCustomSize({...customSize, height: e.target.value})} />
                  </div>
                  <textarea placeholder="Additional Notes" className="bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary w-full resize-none h-24" value={customSize.notes} onChange={e => setCustomSize({...customSize, notes: e.target.value})} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-6 mb-12 h-14">
            <div className="flex items-center border border-border w-32">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary"
              >
                <Minus size={14} />
              </button>
              <span className="flex-1 text-center font-sans text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center text-textSecondary hover:text-textPrimary"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
              Add to Cart
            </button>
          </div>
          
          <div className="pt-8 border-t border-border/30 flex flex-col gap-4">
            <div className="flex justify-between items-center font-sans text-xs tracking-widest uppercase text-textSecondary">
              <span className="flex items-center gap-2"><RefreshCcw size={14} /> Exchange</span>
              <span>Available within 7 days of delivery</span>
            </div>
            <div className="flex justify-between font-sans text-xs tracking-widest uppercase text-textSecondary">
              <span>Policy</span>
              <span>Exchange Only. No Returns.</span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
