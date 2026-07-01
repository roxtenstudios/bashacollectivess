import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, updateDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Package, User, FileText, LogOut, QrCode, X, Copy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Profile() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || 'details';
  const [orders, setOrders] = useState([]);
  
  // Personal Details Form State
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [address, setAddress] = useState(userData?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [retryOrder, setRetryOrder] = useState(null);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
    }
  }, [userData]);

  // Fetch Order History
  useEffect(() => {
    if (currentUser?.email) {
      const q = query(
        collection(db, 'orders'), 
        where('email', '==', currentUser.email)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort manually since we can't easily compound index where + orderBy without throwing an error for new users
        userOrders.sort((a, b) => {
           if(a.timestamp && b.timestamp) return b.timestamp.toMillis() - a.timestamp.toMillis();
           return 0;
        });
        setOrders(userOrders);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || name.trim().length < 2) {
      alert('Please enter a valid name (at least 2 characters).');
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!address.trim() || address.trim().length < 10) {
      alert('Please enter a complete shipping address (at least 10 characters).');
      return;
    }

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      });
      alert('Profile updated successfully.');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRetryPayment = async () => {
    if (!retryOrder) return;
    try {
      await updateDoc(doc(db, 'orders', retryOrder.id), {
        paymentVerified: null,
        status: 'Processing'
      });
      setRetryOrder(null);
      alert('Payment confirmation submitted! We will verify it shortly.');
    } catch (error) {
      console.error("Error retrying payment: ", error);
      alert('Failed to submit retry request.');
    }
  };

  // Official UPI VPA
  const merchantVpa = '6302383384@superyes';
  const merchantName = 'Basha Collectives';
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bgPrimary pt-24 md:pt-32 pb-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="font-serif text-3xl md:text-4xl text-textPrimary mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar */}
          <div className={`w-full md:w-1/4 flex flex-col gap-2 ${tab ? 'hidden md:flex' : 'flex'}`}>
            <button 
              onClick={() => navigate('/profile/details')}
              className={`flex items-center gap-3 px-4 py-3 text-left font-sans text-xs tracking-[0.1em] uppercase transition-colors ${activeTab === 'details' ? 'bg-black text-white' : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary'}`}
            >
              <User size={16} /> Personal Details
            </button>
            <button 
              onClick={() => navigate('/profile/orders')}
              className={`flex items-center gap-3 px-4 py-3 text-left font-sans text-xs tracking-[0.1em] uppercase transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary'}`}
            >
              <Package size={16} /> Order History
            </button>
            <button 
              onClick={() => navigate('/profile/legal')}
              className={`flex items-center gap-3 px-4 py-3 text-left font-sans text-xs tracking-[0.1em] uppercase transition-colors ${activeTab === 'legal' ? 'bg-black text-white' : 'text-textSecondary hover:bg-gray-100 hover:text-textPrimary'}`}
            >
              <FileText size={16} /> Legal & Policies
            </button>
            
            <div className="mt-8 pt-4 border-t border-border">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-left font-sans text-xs tracking-[0.1em] uppercase text-red-500 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className={`w-full md:w-3/4 ${tab ? 'block' : 'hidden md:block'}`}>
            
            {/* Mobile Back Button */}
            {tab && (
              <button 
                onClick={() => navigate('/profile')}
                className="md:hidden flex items-center gap-2 mb-8 text-textSecondary hover:text-textPrimary font-sans text-xs uppercase tracking-widest transition-colors"
              >
                <span className="text-lg">←</span> Back to Profile Menu
              </button>
            )}
            
            {/* Personal Details Tab */}
            {activeTab === 'details' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 border border-border">
                <h2 className="font-serif text-2xl text-textPrimary mb-6">Personal Details</h2>
                <form onSubmit={handleUpdateDetails} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-textSecondary mb-2">Email Address (Cannot be changed)</label>
                    <input 
                      type="email" 
                      value={currentUser?.email || ''} 
                      disabled
                      className="w-full bg-gray-50 border border-border px-4 py-3 font-sans text-sm text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-textSecondary mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      minLength={2}
                      value={name} 
                      onChange={e => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                      className="w-full bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-textSecondary mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      title="Please enter a valid 10-digit phone number."
                      value={phone} 
                      onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-widest text-textSecondary mb-2">Default Shipping Address</label>
                    <textarea 
                      required
                      minLength={10}
                      value={address} 
                      onChange={e => setAddress(e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border border-border px-4 py-3 font-sans text-sm focus:outline-none focus:border-textPrimary resize-none"
                    />
                  </div>
                  <button 
                    type="submit" disabled={isSaving}
                    className="py-4 px-8 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-serif text-2xl text-textPrimary mb-6">Order History & Tracking</h2>
                
                {orders.length === 0 ? (
                  <div className="bg-white p-8 border border-border text-center text-textSecondary font-sans text-sm">
                    You haven't placed any orders yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 border border-border flex flex-col gap-4 hover:border-gray-400 transition-colors duration-300">
                        {/* Header section - Clickable to track */}
                        <div 
                          onClick={() => navigate(`/tracking/${order.id}`)}
                          className="flex justify-between items-start border-b border-border pb-4 cursor-pointer group"
                        >
                          <div className="grid grid-cols-2 gap-4 md:gap-8">
                            <div>
                              <span className="block font-sans text-[10px] uppercase tracking-widest text-textSecondary mb-1">Order ID</span>
                              <span className="font-sans text-xs font-semibold text-textPrimary group-hover:underline uppercase tracking-wider">{order.id.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="block font-sans text-[10px] uppercase tracking-widest text-textSecondary mb-1">Order Date</span>
                              <span className="font-sans text-xs text-textPrimary">{order.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-textSecondary mb-1">Total Amount</span>
                            <span className="font-serif text-base md:text-lg text-textPrimary">₹{order.total?.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        {/* Status section */}
                        <div className="py-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="block font-sans text-[10px] uppercase tracking-widest text-textSecondary mb-1.5">Order Status</span>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wide ${getStatusColor(order.status)}`}>
                              {order.status || 'Processing'}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => navigate(`/tracking/${order.id}`)}
                            className="self-start sm:self-center text-xs font-sans uppercase tracking-[0.15em] font-semibold text-accent hover:text-textPrimary transition-colors flex items-center gap-1.5"
                          >
                            Track Shipment <Package size={14} />
                          </button>
                        </div>

                        {order.paymentVerified === false && (
                          <div className="p-4 bg-red-50 border border-red-100 flex flex-col items-start gap-3">
                            <span className="font-sans text-sm text-red-800 font-medium">Your payment could not be verified.</span>
                            <button 
                              onClick={() => setRetryOrder(order)}
                              className="px-4 py-2 bg-red-600 text-white font-sans text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
                            >
                              Retry Payment
                            </button>
                          </div>
                        )}

                        {/* Items section */}
                        <div>
                          <span className="block font-sans text-[10px] uppercase tracking-widest text-textSecondary mb-2">Items Purchased</span>
                          <div className="flex flex-wrap gap-3">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 pr-5 border border-gray-100">
                                {item.image && (
                                  <img src={item.image} alt={item.title} className="w-8 h-10 object-cover border border-border shrink-0" />
                                )}
                                <div className="flex flex-col">
                                  <span className="font-serif text-xs text-textPrimary font-medium">{item.title}</span>
                                  <span className="font-sans text-[9px] text-textSecondary uppercase mt-0.5">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Legal Tab */}
            {activeTab === 'legal' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 border border-border prose prose-sm max-w-none text-gray-600">
                <h2 className="font-serif text-2xl text-textPrimary mb-6">Legal & Policies</h2>
                
                <h3 className="font-serif text-lg text-textPrimary mt-8 mb-4">Terms and Conditions</h3>
                <p>Welcome to Basha Collectives. By using our website, you agree to these terms. All content is protected by copyright. Prices are subject to change without notice. We reserve the right to refuse service to anyone.</p>

                <h3 className="font-serif text-lg text-textPrimary mt-8 mb-4">Privacy Policy</h3>
                <p>We respect your privacy. We collect your email and address solely for fulfilling orders and improving your experience. We do not sell your personal information to third parties.</p>

                <h3 className="font-serif text-lg text-textPrimary mt-8 mb-4">Return & Exchange Policy</h3>
                <p>Returns are accepted within 14 days of delivery for store credit only. Items must be unworn and in original condition with tags attached. Custom pieces and jewelry are final sale.</p>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* Retry Payment Modal */}
      {retryOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bgPrimary w-full max-w-md p-8 relative shadow-2xl flex flex-col gap-6">
            <button 
              onClick={() => setRetryOrder(null)}
              className="absolute top-4 right-4 text-textSecondary hover:text-textPrimary transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>
            
            <div>
              <h2 className="font-serif text-2xl text-textPrimary mb-2">Retry Payment</h2>
              <span className="font-sans text-xs text-textSecondary">Copy the UPI ID below to pay securely via any UPI App. Amount is locked.</span>
            </div>
            
            <div className="border border-border p-8 flex flex-col items-center gap-8 bg-white/5">
              <div className="flex flex-col items-center gap-2 w-full max-w-sm">
                <span className="font-sans text-xs text-textSecondary uppercase tracking-widest">Official UPI ID</span>
                <div className="flex items-center justify-between w-full bg-white px-4 py-3 border border-border shadow-sm">
                  <span className="font-serif text-lg text-textPrimary font-bold select-all">{merchantVpa}</span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(merchantVpa);
                      alert('UPI ID Copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-xs uppercase font-sans tracking-widest text-textPrimary hover:opacity-70 transition-opacity"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="font-sans text-sm font-medium">Scan with any UPI App</p>
                <p className="font-sans text-xs text-textSecondary">GPay, PhonePe, Paytm, CRED, etc.</p>
              </div>

              <div className="w-full flex items-center gap-4">
                <div className="h-px bg-border flex-1"></div>
                <span className="font-sans text-xs text-textSecondary uppercase tracking-widest">OR</span>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <a 
                href={`upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${retryOrder.total?.toFixed(2)}&cu=INR&mc=5691&tn=Order%20Payment`}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black border border-black font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-100 transition-colors"
              >
                <QrCode size={16} />
                Open UPI App to Pay
              </a>
            </div>

            <button 
              onClick={handleRetryPayment}
              className="w-full py-4 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
              Confirm I Have Paid
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
