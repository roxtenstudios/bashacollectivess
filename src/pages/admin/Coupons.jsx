import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit2 } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

const Coupons = () => {
  const [couponsData, setCouponsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    status: 'Active',
    usage: '0'
  });

  const openAddModal = () => {
    setEditingId(null);
    setNewCoupon({ code: '', type: 'Percentage', value: '', status: 'Active', usage: '0' });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingId(coupon.id);
    let parsedValue = coupon.value;
    if (typeof parsedValue === 'string') {
      parsedValue = parsedValue.replace('%', '').replace('₹', '');
    }
    setNewCoupon({
      code: coupon.code,
      type: coupon.type,
      value: parsedValue,
      status: coupon.status || 'Active',
      usage: coupon.usage || '0'
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    const q = query(collection(db, 'coupons'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coupons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCouponsData(coupons);
    });
    return () => unsubscribe();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;
    setIsSubmitting(true);

    try {
      const couponData = {
        code: newCoupon.code.toUpperCase(),
        type: newCoupon.type,
        value: newCoupon.type === 'Percentage' ? `${newCoupon.value}%` : `₹${parseFloat(newCoupon.value).toFixed(2)}`,
        status: newCoupon.status,
        usage: newCoupon.usage,
        timestamp: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'coupons', editingId), couponData);
      } else {
        await addDoc(collection(db, 'coupons'), couponData);
      }

      setIsModalOpen(false);
      setNewCoupon({ code: '', type: 'Percentage', value: '', status: 'Active', usage: '0' });
    } catch (error) {
      console.error("Error adding coupon: ", error);
      alert("Failed to create coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
      } catch (error) {
        console.error("Error deleting coupon: ", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Coupons</h1>
        <button 
          onClick={openAddModal}
          className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couponsData.map((coupon) => (
              <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{coupon.code}</td>
                <td className="px-6 py-4">{coupon.type}</td>
                <td className="px-6 py-4 text-gray-900">{coupon.value}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4">{coupon.usage}</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button onClick={() => openEditModal(coupon)} className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {couponsData.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
              <X size={20} />
            </button>
            <h2 className="text-xl font-serif text-gray-900 mb-6">{editingId ? 'Edit Coupon' : 'Create New Coupon'}</h2>
            
            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Coupon Code</label>
                <input 
                  type="text" required placeholder="e.g. SUMMER24"
                  value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900 uppercase"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Discount Type</label>
                  <select 
                    value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                  >
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-gray-600 mb-1">Value</label>
                  <input 
                    type="number" required min="0" step="0.01"
                    value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
                    className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 text-gray-900"
                  />
                </div>
              </div>
              
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-black transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Coupon' : 'Create Coupon')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
