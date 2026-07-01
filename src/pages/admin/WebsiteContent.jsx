import React, { useState, useEffect } from 'react';
import { Layout, Save, CheckCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const WebsiteContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [content, setContent] = useState({
    heroVideo: '',
    heroTitle: '',
    lookbook1: '',
    lookbook2: '',
    lookbook3: '',
    lookbook4: '',
    lookbook5: '',
    exclusive1: '',
    exclusive2: '',
    exclusive3: '',
    exclusive4: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent({ ...content, ...docSnap.data() });
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
      await setDoc(doc(db, 'settings', 'homepage'), content);
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

  if (loading) return <div>Loading...</div>;

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
              <input type="text" value={content.heroTitle} onChange={(e) => handleChange('heroTitle', e.target.value)} placeholder="e.g. Quiet Luxury" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Background Video URL (mp4)</label>
              <input type="url" value={content.heroVideo} onChange={(e) => handleChange('heroVideo', e.target.value)} placeholder="e.g. https://example.com/video.mp4" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Lookbook Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Layout className="text-gray-500" />
            <h2 className="text-xl font-medium text-gray-900">Lookbook Images (5 required)</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <label className="block text-sm text-gray-600 mb-1">Lookbook Image {i} URL</label>
                <input type="url" value={content[`lookbook${i}`]} onChange={(e) => handleChange(`lookbook${i}`, e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
              </div>
            ))}
          </div>
        </div>

        {/* Exclusive Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
            <Layout className="text-gray-500" />
            <h2 className="text-xl font-medium text-gray-900">Exclusive Collection Images (4 required)</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <label className="block text-sm text-gray-600 mb-1">Exclusive Image {i} URL</label>
                <input type="url" value={content[`exclusive${i}`]} onChange={(e) => handleChange(`exclusive${i}`, e.target.value)} placeholder="e.g. https://example.com/img.jpg" className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteContent;
