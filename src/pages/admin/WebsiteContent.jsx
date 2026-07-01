import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle, Search } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { IMAGES } from '../../data/images';
import { uploadImage } from '../../services/uploadImage';

const ProductSelector = ({ products, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const selectedProduct = products.find(p => p.id === value);
  const filteredProducts = products.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <div 
        className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 cursor-pointer text-sm text-gray-900 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedProduct ? selectedProduct.name : '-- Select a Product --'}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white border-b border-gray-100 z-10">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded pl-8 pr-2 py-1.5 text-sm focus:outline-none focus:border-gray-400"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
            <div 
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => { onChange(''); setIsOpen(false); }}
            >
              -- None --
            </div>
            {filteredProducts.map(p => (
              <div 
                key={p.id}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => { onChange(p.id); setIsOpen(false); }}
              >
                {p.image && <img src={p.image} alt="" className="w-6 h-6 object-cover rounded" />}
                <span className="truncate">{p.name}</span>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 italic">No products found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const WebsiteContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  
  const [content, setContent] = useState({
    heroVideo: '',
    heroTitle: '',
    philosophyImg: '',
    visionImg: '',
    lookbookMedia: [],
    shopByLookMedia: [] // Array of { videoUrl: '', productId: '' }
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        
        const defaultLookbook = IMAGES.lookbook.map(img => img.src);
        const defaultShopByLook = [{ videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5450-183786500_tiny.mp4', productId: '' }];

        // Fetch products for dropdown
        const prodSnap = await getDocs(collection(db, 'products'));
        const prods = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(prods);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Migrate shopByLookMedia to object array
          let loadedShopByLook = defaultShopByLook;
          if (data.shopByLookMedia && data.shopByLookMedia.length > 0) {
            loadedShopByLook = data.shopByLookMedia.map(item => {
              if (typeof item === 'string') {
                return { videoUrl: item, productId: '' }; // Upgrade old strings to objects
              }
              return item;
            });
          }

          setContent(prev => ({
            ...prev,
            ...data,
            lookbookMedia: data.lookbookMedia && data.lookbookMedia.length > 0 ? data.lookbookMedia : defaultLookbook,
            shopByLookMedia: loadedShopByLook,
            heroTitle: data.heroTitle || 'Quiet Luxury',
            philosophyImg: data.philosophyImg || IMAGES.philosophy,
            visionImg: data.visionImg || IMAGES.craft
          }));
        } else {
          // If no doc exists at all, populate with full defaults
          setContent({
            heroVideo: '',
            heroTitle: 'Quiet Luxury',
            philosophyImg: IMAGES.philosophy,
            visionImg: IMAGES.craft,
            lookbookMedia: defaultLookbook,
            shopByLookMedia: defaultShopByLook
          });
        }
      } catch (err) {
        console.error("Error fetching website content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'homepage'), content, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setContent(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    if (field === 'shopByLookMedia') {
      setContent(prev => ({ ...prev, [field]: [...prev[field], { videoUrl: '', productId: '' }] }));
    } else {
      setContent(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    }
  };

  const removeArrayItem = (field, index) => {
    setContent(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  const handleFileUpload = async (field, file, index = null) => {
    if (!file) return;
    const uploadId = index !== null ? `${field}-${index}` : field;
    setUploadingField(uploadId);
    try {
      const url = await uploadImage(file, 'website-content');
      if (index !== null) {
        if (field === 'shopByLookMedia') {
          setContent(prev => {
            const newArray = [...prev[field]];
            newArray[index] = { ...newArray[index], videoUrl: url };
            return { ...prev, [field]: newArray };
          });
        } else {
          handleArrayChange(field, index, url);
        }
      } else {
        handleChange(field, url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingField(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  const handleShopByLookChange = (index, key, value) => {
    setContent(prev => {
      const newArray = [...prev.shopByLookMedia];
      newArray[index] = { ...newArray[index], [key]: value };
      return { ...prev, shopByLookMedia: newArray };
    });
  };

  const renderShopByLookArray = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Layout className="text-gray-500" />
          <h2 className="text-xl font-medium text-gray-900">Shop By Look Videos</h2>
        </div>
        <button onClick={() => addArrayItem('shopByLookMedia')} className="text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
          + Add New
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {content.shopByLookMedia.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-100 rounded bg-gray-50">
            <div className="flex-1 w-full flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Video URL (mp4)</label>
                <input 
                  type="url" 
                  value={item.videoUrl} 
                  onChange={(e) => handleShopByLookChange(index, 'videoUrl', e.target.value)} 
                  placeholder="e.g. https://example.com/video.mp4" 
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" 
                />
                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="file" accept="video/*"
                    onChange={e => handleFileUpload('shopByLookMedia', e.target.files[0], index)}
                    className="text-sm text-gray-600"
                  />
                  {uploadingField === `shopByLookMedia-${index}` && <span className="text-sm text-blue-600">Uploading...</span>}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Link to Product</label>
                <ProductSelector 
                  products={products} 
                  value={item.productId || ''} 
                  onChange={(val) => handleShopByLookChange(index, 'productId', val)} 
                />
              </div>
            </div>
            <button onClick={() => removeArrayItem('shopByLookMedia', index)} className="text-red-500 hover:bg-red-50 p-2 rounded self-start">
              Remove
            </button>
          </div>
        ))}
        {content.shopByLookMedia.length === 0 && <p className="text-sm text-gray-500 italic">No videos added yet.</p>}
      </div>
    </div>
  );

  const renderDynamicArray = (title, field, placeholder) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Layout className="text-gray-500" />
          <h2 className="text-xl font-medium text-gray-900">{title}</h2>
        </div>
        <button onClick={() => addArrayItem(field)} className="text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
          + Add New
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {content[field].map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex-1 w-full flex flex-col gap-2">
              <input 
                type="url" 
                value={item} 
                onChange={(e) => handleArrayChange(field, index, e.target.value)} 
                placeholder={placeholder} 
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
              <div className="flex items-center gap-2">
                <input 
                  type="file" accept="image/*,video/*"
                  onChange={e => handleFileUpload(field, e.target.files[0], index)}
                  className="text-sm text-gray-600"
                />
                {uploadingField === `${field}-${index}` && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>
            <button onClick={() => removeArrayItem(field, index)} className="text-red-500 hover:bg-red-50 p-2 rounded self-start mt-1">
              X
            </button>
          </div>
        ))}
        {content[field].length === 0 && <p className="text-sm text-gray-500 italic">No media added yet.</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Website Content</h1>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-gray-900 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
        >
          {success ? <CheckCircle size={18} className="text-green-400" /> : <Save size={18} />}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Layout className="text-gray-500" />
            <h2 className="text-xl font-medium text-gray-900">Hero Section</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hero Title</label>
              <input type="text" value={content.heroTitle || ''} onChange={(e) => handleChange('heroTitle', e.target.value)} placeholder="e.g. Quiet Luxury" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Background Video URL (mp4)</label>
              <input type="url" value={content.heroVideo || ''} onChange={(e) => handleChange('heroVideo', e.target.value)} placeholder="e.g. https://example.com/video.mp4" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900 mb-2" />
              <div className="flex items-center gap-2">
                <input type="file" accept="video/*" onChange={e => handleFileUpload('heroVideo', e.target.files[0])} className="text-sm text-gray-600" />
                {uploadingField === 'heroVideo' && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Layout className="text-gray-500" />
            <h2 className="text-xl font-medium text-gray-900">Philosophy Section</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Philosophy Image URL</label>
              <input type="url" value={content.philosophyImg || ''} onChange={(e) => handleChange('philosophyImg', e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900 mb-2" />
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={e => handleFileUpload('philosophyImg', e.target.files[0])} className="text-sm text-gray-600" />
                {uploadingField === 'philosophyImg' && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Vision Background Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Layout className="text-gray-500" />
            <h2 className="text-xl font-medium text-gray-900">The Vision Section</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Vision Background Image URL</label>
              <input type="url" value={content.visionImg || ''} onChange={(e) => handleChange('visionImg', e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900 mb-2" />
              <div className="flex items-center gap-2">
                <input type="file" accept="image/*" onChange={e => handleFileUpload('visionImg', e.target.files[0])} className="text-sm text-gray-600" />
                {uploadingField === 'visionImg' && <span className="text-sm text-blue-600">Uploading...</span>}
              </div>
            </div>
          </div>
        </div>

        {renderDynamicArray("Lookbook Images", "lookbookMedia", "e.g. https://example.com/img.jpg")}
        {renderShopByLookArray()}

      </div>
    </div>
  );
};

export default WebsiteContent;
