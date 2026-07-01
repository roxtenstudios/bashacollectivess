import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, QrCode, Copy, RefreshCcw, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, increment, doc, getDoc } from 'firebase/firestore';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi_app');

  // Dialog State
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [storeSettings, setStoreSettings] = useState({ upiId: '6302383384@superyes', upiQrCodeUrl: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'store');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStoreSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const merchantVpa = storeSettings.upiId || '6302383384@superyes';
  const merchantName = 'Basha Collectives';
  const upiLink = `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${cartTotal.toFixed(2)}&cu=INR&mc=5691&tn=Order%20Payment`;

  if (cartItems.length === 0 && !success) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-bgPrimary gap-6">
        <h1 className="font-serif text-3xl">Your cart is empty.</h1>
        <Link to="/store" className="border-b border-textPrimary text-textPrimary font-sans text-xs tracking-widest uppercase hover:opacity-70">
          Return to Store
        </Link>
      </div>
    );
  }

  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }
    }
    
    if (step === 2) {
      if (!firstName.trim() || firstName.trim().length < 2) {
        alert('Please enter a valid first name (at least 2 characters).');
        return;
      }
      if (!lastName.trim() || lastName.trim().length < 1) {
        alert('Please enter a valid last name.');
        return;
      }
      if (!address.trim() || address.trim().length < 10) {
        alert('Please enter a complete shipping address (at least 10 characters).');
        return;
      }
      if (!city.trim()) {
        alert('Please enter a city.');
        return;
      }
      if (!state.trim()) {
        alert('Please enter a state.');
        return;
      }
      const pincodeRegex = /^[0-9]{6}$/;
      if (!pincodeRegex.test(zip)) {
        alert('Please enter a valid 6-digit PIN code.');
        return;
      }
    }

    if (step < 3) setStep(step + 1);
  };

  const handlePayViaApp = () => {
    window.location.href = upiLink;
    // Show the "Are you done?" dialog after a short delay to allow the app to open
    setTimeout(() => {
      setShowPaymentDialog(true);
    }, 1500);
  };

  const handlePlaceOrder = async () => {
    try {
      const fullAddress = `${address}, ${city}, ${state} ${zip}`;
      const newOrderRef = await addDoc(collection(db, 'orders'), {
        customer: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        address: fullAddress,
        total: cartTotal,
        paymentMethod: paymentMethod,
        paymentVerified: paymentMethod === 'cod' ? 'COD' : null,
        status: 'Processing',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: serverTimestamp(),
        items: cartItems.map(item => ({ 
          id: item.id, 
          title: item.title, 
          size: item.size, 
          customSize: item.customSize || null,
          quantity: item.quantity, 
          price: item.price,
          image: item.image || null
        }))
      });

      setOrderId(newOrderRef.id);

      const customersRef = collection(db, 'customers');
      const q = query(customersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(customersRef, {
          name: `${firstName} ${lastName}`,
          email: email,
          phone: phone,
          orders: 1,
          spent: cartTotal,
          joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: serverTimestamp()
        });
      } else {
        const customerDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'customers', customerDoc.id), {
          orders: increment(1),
          spent: increment(cartTotal)
        });
      }

      setSuccess(true);
      setShowPaymentDialog(false);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bgPrimary pt-24 md:pt-32 pb-24"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* LEFT COLUMN: Checkout Form */}
        <div className="w-full lg:w-3/5 flex flex-col gap-12 bg-white/60 p-8 md:p-12 rounded-[2rem] shadow-soft backdrop-blur-xl border border-white/50">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 font-sans text-[10px] md:text-xs tracking-widest uppercase text-textSecondary bg-white/40 w-fit max-w-full px-5 md:px-6 py-3 rounded-2xl md:rounded-full border border-white/50 shadow-sm">
            <button onClick={() => setStep(1)} className="hover:text-textPrimary transition-colors font-medium">Store</button>
            <ChevronRight size={14} className="opacity-50" />
            <button onClick={() => setStep(1)} className={`${step >= 1 ? "text-textPrimary font-semibold" : ""} hover:opacity-70 transition-opacity`}>Information</button>
            <ChevronRight size={14} className="opacity-50" />
            <button onClick={() => step > 1 && setStep(2)} className={`${step >= 2 ? "text-textPrimary font-semibold" : ""} hover:opacity-70 transition-opacity`}>Shipping</button>
            <ChevronRight size={14} className="opacity-50" />
            <span className={step >= 3 ? "text-textPrimary font-semibold" : ""}>Payment</span>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: CONTACT INFORMATION */}
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNextStep} 
                className="flex flex-col gap-6"
              >
                <h2 className="font-serif text-3xl md:text-4xl text-textPrimary mb-6 font-light tracking-wide">Contact Information</h2>
                <div className="flex flex-col gap-4">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    title="Please enter a valid email address."
                    className="w-full bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone number (10 digits)" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a valid 10-digit phone number."
                    className="w-full bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60"
                  />
                </div>
                <button type="submit" className="w-full py-4 mt-8 bg-textPrimary text-white font-sans text-xs tracking-[0.25em] uppercase rounded-full hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                  Continue to Shipping
                </button>
              </motion.form>
            )}

            {/* STEP 2: SHIPPING DETAILS */}
            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNextStep} 
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between mb-4 border-b border-border/30 pb-4">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-textSecondary block">Contact</span>
                    <span className="font-sans text-sm">{email}</span>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="font-sans text-[10px] uppercase tracking-widest text-textSecondary underline hover:text-textPrimary">Change</button>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-textPrimary flex items-center gap-3 font-light tracking-wide mb-2 mt-4">
                  <MapPin strokeWidth={1.5} className="text-textSecondary" /> Shipping Address
                </h2>
                
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <input type="text" placeholder="First name" required minLength={2} value={firstName} onChange={e => setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} className="w-full bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" />
                    <input type="text" placeholder="Last name" required minLength={1} value={lastName} onChange={e => setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} className="w-full bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" />
                  </div>
                  <input type="text" placeholder="Address" required minLength={10} value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" />
                  <div className="flex flex-col md:flex-row gap-4">
                    <input type="text" placeholder="City" required value={city} onChange={e => setCity(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} className="w-full md:w-1/3 bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" />
                    <input type="text" placeholder="State" required value={state} onChange={e => setState(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} className="w-full md:w-1/3 bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" />
                    <input 
                      type="text" 
                      placeholder="PIN code (6 digits)" 
                      required 
                      value={zip} 
                      onChange={e => setZip(e.target.value.replace(/[^0-9]/g, ''))} 
                      pattern="[0-9]{6}" 
                      maxLength={6}
                      title="Please enter a valid 6-digit PIN code."
                      className="w-full md:w-1/3 bg-bgSecondary/50 border border-border/30 px-6 py-4 font-sans text-sm rounded-xl focus:outline-none focus:border-textPrimary focus:bg-white transition-all duration-300 placeholder:text-textSecondary/60" 
                    />
                  </div>
                </div>
                
                <div className="flex flex-col-reverse md:flex-row justify-between items-center mt-8 gap-6">
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-textSecondary hover:text-textPrimary transition-colors w-full md:w-auto justify-center">
                    <ChevronLeft size={14} /> Return to Information
                  </button>
                  <button type="submit" className="w-full md:w-auto py-4 px-10 bg-textPrimary text-white font-sans text-xs tracking-[0.25em] uppercase rounded-full hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300">
                    Continue to Payment
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 3: PAYMENT */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-4 mb-4 border-b border-border/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-textSecondary block">Contact</span>
                      <span className="font-sans text-sm">{email}</span>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="font-sans text-[10px] uppercase tracking-widest text-textSecondary underline hover:text-textPrimary">Change</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-textSecondary block">Ship to</span>
                      <span className="font-sans text-sm">{address}, {city} {zip}</span>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="font-sans text-[10px] uppercase tracking-widest text-textSecondary underline hover:text-textPrimary">Change</button>
                  </div>
                </div>

                <h2 className="font-serif text-3xl md:text-4xl text-textPrimary flex items-center gap-3 font-light tracking-wide mb-2 mt-4">
                  <QrCode strokeWidth={1.5} className="text-textSecondary" /> Payment Details
                </h2>
                <p className="font-sans text-sm text-textSecondary">Amount is locked and cannot be changed.</p>
                
                <div className="flex flex-col gap-4 mt-6">
                  
                  {/* Option 1: Pay by UPI Apps */}
                  <div 
                    className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${paymentMethod === 'upi_app' ? 'border-textPrimary bg-white/60 shadow-md' : 'border-border/50 bg-white/20 hover:bg-white/40'}`} 
                    onClick={() => setPaymentMethod('upi_app')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'upi_app' ? 'border-textPrimary' : 'border-textSecondary/50'}`}>
                        {paymentMethod === 'upi_app' && <div className="w-3 h-3 bg-textPrimary rounded-full" />}
                      </div>
                      <span className="font-serif text-xl text-textPrimary">Pay by any UPI App</span>
                    </div>
                    
                    <AnimatePresence>
                      {paymentMethod === 'upi_app' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-6 pb-2 flex flex-col items-center gap-6">
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handlePayViaApp(); }} 
                              className="w-full py-4 bg-textPrimary text-white font-sans text-xs tracking-[0.25em] uppercase rounded-full hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
                            >
                              Open UPI App
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Option 2: Copy UPI ID */}
                  <div 
                    className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${paymentMethod === 'upi_id' ? 'border-textPrimary bg-white/60 shadow-md' : 'border-border/50 bg-white/20 hover:bg-white/40'}`} 
                    onClick={() => setPaymentMethod('upi_id')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'upi_id' ? 'border-textPrimary' : 'border-textSecondary/50'}`}>
                        {paymentMethod === 'upi_id' && <div className="w-3 h-3 bg-textPrimary rounded-full" />}
                      </div>
                      <span className="font-serif text-xl text-textPrimary">Copy UPI ID</span>
                    </div>
                    
                    <AnimatePresence>
                      {paymentMethod === 'upi_id' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-6 pb-2">
                            <span className="font-sans text-[10px] text-textSecondary uppercase tracking-widest block mb-2">Official UPI ID</span>
                            <div className="flex items-center justify-between w-full bg-white px-4 py-3 md:px-6 md:py-4 rounded-xl border border-border/50 shadow-sm gap-2">
                              <span className="font-serif text-sm md:text-base text-textPrimary font-semibold select-all truncate flex-1">{merchantVpa}</span>
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(merchantVpa);
                                  alert('UPI ID Copied to clipboard!');
                                  setShowPaymentDialog(true);
                                }}
                                className="flex items-center gap-2 text-[10px] md:text-xs uppercase font-sans tracking-widest text-textPrimary hover:opacity-70 transition-opacity bg-bgSecondary/50 px-3 py-2 md:px-4 rounded-lg shrink-0"
                              >
                                <Copy size={14} /> Copy
                              </button>
                            </div>
                            <p className="font-sans text-xs text-textSecondary mt-4 leading-relaxed">Copy the UPI ID above, paste it in your UPI app, make the payment, and click the button below once done.</p>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); setShowPaymentDialog(true); }} 
                              className="w-full mt-6 py-4 border border-textPrimary text-textPrimary font-sans text-xs tracking-[0.25em] uppercase rounded-full hover:bg-textPrimary hover:text-white transition-colors"
                            >
                              I have made the payment
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Option 3: Cash on Delivery */}
                  <div 
                    className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${paymentMethod === 'cod' ? 'border-textPrimary bg-white/60 shadow-md' : 'border-border/50 bg-white/20 hover:bg-white/40'}`} 
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'border-textPrimary' : 'border-textSecondary/50'}`}>
                        {paymentMethod === 'cod' && <div className="w-3 h-3 bg-textPrimary rounded-full" />}
                      </div>
                      <span className="font-serif text-xl text-textPrimary">Cash on Delivery (COD)</span>
                    </div>
                    
                    <AnimatePresence>
                      {paymentMethod === 'cod' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="pt-6 pb-2">
                            <p className="font-sans text-sm text-textSecondary mb-6">Pay securely in cash when your order arrives at your shipping address.</p>
                            <button 
                              type="button" 
                              onClick={(e) => { e.stopPropagation(); handlePlaceOrder(); }} 
                              className="w-full py-4 bg-textPrimary text-white font-sans text-xs tracking-[0.25em] uppercase rounded-full hover:bg-black transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300"
                            >
                              Complete Order
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        <div className="w-full lg:w-2/5 flex flex-col gap-8 bg-white/60 p-8 lg:p-12 lg:sticky lg:top-32 h-fit rounded-[2rem] shadow-soft backdrop-blur-xl border border-white/50">
          <h2 className="font-serif text-3xl md:text-4xl text-textPrimary mb-2 font-light tracking-wide">Order Summary</h2>
          
          <div className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto pr-2">
            {cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-white shrink-0 border border-border/50">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-textPrimary text-white flex items-center justify-center rounded-full font-sans text-[10px]">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-serif text-lg text-textPrimary">{item.title}</span>
                  <span className="font-sans text-xs text-textSecondary uppercase tracking-widest mt-1">{item.size}</span>
                </div>
                <span className="font-sans text-sm text-textPrimary">
                  ₹{typeof item.price === 'number' ? item.price.toFixed(2) : (!isNaN(Number(String(item.price).replace(/[^0-9.]/g, ''))) ? Number(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2) : '0.00')}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-border/30 pt-6">
            <div className="flex justify-between font-sans text-sm text-textSecondary">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-sans text-sm text-textSecondary">
              <span>Shipping</span>
              <span className={step >= 3 ? "text-textPrimary uppercase tracking-widest text-[10px]" : ""}>{step >= 3 ? "FREE" : "Calculated at next step"}</span>
            </div>
          </div>

          <div className="flex justify-between font-sans text-lg text-textPrimary border-t border-border/30 pt-6">
            <span>Total</span>
            <span className="font-bold">INR ₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Payment Confirmation Dialog */}
      <AnimatePresence>
        {showPaymentDialog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 text-center border-t-4 border-textPrimary"
            >
              <h3 className="font-serif text-2xl text-textPrimary">Payment Status</h3>
              <p className="font-sans text-sm text-textSecondary">
                Are you done with your payment process?
              </p>
              
              <div className="flex flex-col gap-3 mt-4">
                <button 
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-green-600 text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-md"
                >
                  <CheckCircle2 size={16} /> Yes, I am done
                </button>
                <button 
                  onClick={() => setShowPaymentDialog(false)}
                  className="w-full py-4 bg-transparent border border-border text-textPrimary font-sans text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                >
                  <RefreshCcw size={16} /> No, I want to retry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] bg-bgPrimary flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <CheckCircle2 size={80} strokeWidth={1} className="text-green-600 mb-8 mx-auto" />
            </motion.div>
            <h1 className="font-serif text-4xl md:text-5xl text-textPrimary mb-4">Order Under Process</h1>
            <p className="font-sans text-textSecondary mb-12 max-w-md">
              Thank you for your purchase, {firstName || 'Guest'}. Your payment verification is pending.
            </p>
            <button 
              onClick={() => navigate(`/tracking/${orderId}`)}
              className="px-8 py-4 bg-textPrimary text-white font-sans text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors"
            >
              Track Your Order
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
