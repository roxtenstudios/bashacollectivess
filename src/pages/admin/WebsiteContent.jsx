import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { IMAGES } from '../../data/images';

const WebsiteContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [content, setContent] = useState({
    heroVideo: '',
    heroTitle: '',
    philosophyImg: '',
    visionImg: '',
    lookbookMedia: [],
    galleryWallMedia: [],
    shopByLookMedia: []
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        
        const defaultLookbook = IMAGES.lookbook.map(img => img.src);
        const defaultGallery = IMAGES.canvas.filter(item => item.type === 'image').map(item => item.src);
        const defaultShopByLook = ['https://cdn.pixabay.com/video/2016/09/21/5450-183786500_tiny.mp4']; // Or any default video

        if (docSnap.exists()) {
          const data = docSnap.data();
          setContent(prev => ({
            ...prev,
            ...data,
            lookbookMedia: data.lookbookMedia && data.lookbookMedia.length > 0 ? data.lookbookMedia : defaultLookbook,
            galleryWallMedia: data.galleryWallMedia && data.galleryWallMedia.length > 0 ? data.galleryWallMedia : defaultGallery,
            shopByLookMedia: data.shopByLookMedia && data.shopByLookMedia.length > 0 ? data.shopByLookMedia : defaultShopByLook,
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
            galleryWallMedia: defaultGallery,
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
    setContent(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setContent(prev => {
      const newArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  if (loading) return <div>Loading...</div>;

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
          <div key={index} className="flex items-center gap-2">
            <input 
              type="url" 
              value={item} 
              onChange={(e) => handleArrayChange(field, index, e.target.value)} 
              placeholder={placeholder} 
              className="flex-1 bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" 
            />
            <button onClick={() => removeArrayItem(field, index)} className="text-red-500 hover:bg-red-50 p-2 rounded">
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
              <input type="url" value={content.heroVideo || ''} onChange={(e) => handleChange('heroVideo', e.target.value)} placeholder="e.g. https://example.com/video.mp4" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
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
              <input type="url" value={content.philosophyImg || ''} onChange={(e) => handleChange('philosophyImg', e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
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
              <input type="url" value={content.visionImg || ''} onChange={(e) => handleChange('visionImg', e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
            </div>
          </div>
        </div>

        {renderDynamicArray("Lookbook Images", "lookbookMedia", "e.g. https://example.com/img.jpg")}
        {renderDynamicArray("Gallery Wall Images", "galleryWallMedia", "e.g. https://example.com/img.jpg")}
        {renderDynamicArray("Shop By Look Videos", "shopByLookMedia", "e.g. https://example.com/video.mp4")}

      </div>
    </div>
  );
};

export default WebsiteContent;
