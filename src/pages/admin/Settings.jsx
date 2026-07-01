import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const Settings = () => {
  const [settings, setSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    cryptoEnabled: false,
    deliveryCharge: 25,
    freeDeliveryThreshold: 500,
    taxRate: 8.5,
    upiId: '6302383384@superyes',
    upiQrCodeUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'store'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'store'), settings, { merge: true });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Store Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
          <h2 className="text-xl font-medium border-b border-gray-200 pb-4 text-gray-900">Payment Options</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-center justify-between">
              <span>Credit / Debit Card (Stripe)</span>
              <input type="checkbox" className="toggle" checked={settings.stripeEnabled} onChange={e => setSettings({...settings, stripeEnabled: e.target.checked})} />
            </div>
            <div className="flex items-center justify-between">
              <span>PayPal</span>
              <input type="checkbox" className="toggle" checked={settings.paypalEnabled} onChange={e => setSettings({...settings, paypalEnabled: e.target.checked})} />
            </div>
            <div className="flex items-center justify-between">
              <span>Cryptocurrency</span>
              <input type="checkbox" className="toggle" checked={settings.cryptoEnabled} onChange={e => setSettings({...settings, cryptoEnabled: e.target.checked})} />
            </div>
          </div>
          
          <h2 className="text-xl font-medium border-b border-gray-200 pb-4 text-gray-900 mt-8">UPI Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Merchant UPI ID</label>
              <input 
                type="text" 
                value={settings.upiId || ''} 
                onChange={e => setSettings({...settings, upiId: e.target.value})} 
                placeholder="e.g. yourname@upi"
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">QR Code Image URL</label>
              <input 
                type="text" 
                value={settings.upiQrCodeUrl || ''} 
                onChange={e => setSettings({...settings, upiQrCodeUrl: e.target.value})} 
                placeholder="https://example.com/my-qr-code.jpg"
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
          <h2 className="text-xl font-medium border-b border-gray-200 pb-4 text-gray-900">Charges & Taxes</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Standard Delivery Charge (₹)</label>
              <input 
                type="number" 
                value={settings.deliveryCharge} 
                onChange={e => setSettings({...settings, deliveryCharge: parseFloat(e.target.value)})} 
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Free Delivery Threshold (₹)</label>
              <input 
                type="number" 
                value={settings.freeDeliveryThreshold} 
                onChange={e => setSettings({...settings, freeDeliveryThreshold: parseFloat(e.target.value)})} 
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Standard Tax Rate (%)</label>
              <input 
                type="number" step="0.1"
                value={settings.taxRate} 
                onChange={e => setSettings({...settings, taxRate: parseFloat(e.target.value)})} 
                className="w-full bg-white border border-gray-200 rounded-md py-2 px-4 focus:outline-none focus:border-gray-400 text-gray-900" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
