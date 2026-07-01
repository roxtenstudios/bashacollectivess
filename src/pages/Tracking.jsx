import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Package, CheckCircle2, Truck, Box, AlertCircle, ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function Tracking() {
  const { orderId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      setSearchInput(orderId);
      fetchOrder(orderId);
    }
  }, [orderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/tracking/${searchInput.trim()}`);
    }
  };

  const getStepStatus = (stepName) => {
    if (!order) return 'pending';
    const status = order.status || 'Processing';
    const stages = ['Processing', 'Shipped', 'Delivered'];
    
    // If order is cancelled/exchanged, we keep the last logistics status before cancellation/exchange for display
    let currentLogisticsStatus = status;
    if (status === 'Cancelled' || status === 'Exchange Requested' || status === 'Exchanged') {
      currentLogisticsStatus = 'Delivered'; // Default to show final stage completed if they were delivered
    }
    
    const currentIndex = stages.indexOf(currentLogisticsStatus) === -1 ? 0 : stages.indexOf(currentLogisticsStatus);
    const stepIndex = stages.indexOf(stepName);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-50 text-green-700 border-green-200/50';
      case 'Processing': return 'bg-yellow-50 text-yellow-700 border-yellow-200/50';
      case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200/50';
      case 'Exchange Requested': return 'bg-purple-50 text-purple-700 border-purple-200/50';
      case 'Exchanged': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200/50';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-bgPrimary pt-28 md:pt-36 pb-24 px-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Navigation / Back Header */}
        <div className="flex justify-between items-center">
          {currentUser && (
            <button 
              onClick={() => navigate('/profile/orders')}
              className="flex items-center gap-2 text-textSecondary hover:text-textPrimary font-sans text-xs uppercase tracking-widest transition-colors duration-200"
            >
              <ArrowLeft size={16} /> Back to My Orders
            </button>
          )}
          {!currentUser && (
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-textSecondary hover:text-textPrimary font-sans text-xs uppercase tracking-widest transition-colors duration-200"
            >
              <ArrowLeft size={16} /> Home
            </button>
          )}
        </div>

        {/* Search header card */}
        <div className="text-center flex flex-col items-center gap-4">
          <h1 className="font-serif text-3xl md:text-5xl text-textPrimary tracking-tight">Track Your Shipment</h1>
          <p className="font-sans text-xs md:text-sm text-textSecondary max-w-md uppercase tracking-wider">
            Enter your order ID below for real-time delivery status.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-lg mt-6 relative shadow-soft rounded-lg overflow-hidden group">
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. ICiEJQwT4zL2AQU1RoG4)" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-white border border-border px-6 py-4.5 pr-16 font-sans text-sm text-textPrimary focus:outline-none focus:border-textPrimary focus:ring-1 focus:ring-textPrimary/20 transition-all duration-300 shadow-sm"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary p-2 transition-colors duration-200">
              <Search size={18} />
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-textSecondary border-t-textPrimary rounded-full animate-spin"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 text-red-700 border border-red-200/50 p-6 text-center font-sans text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 max-w-lg mx-auto w-full">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {order && !loading && (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Main Order Details Card */}
            <div className="bg-bgCard border border-border/80 rounded-xl p-6 md:p-10 shadow-soft flex flex-col gap-8 md:gap-10">
              
              {/* Order ID and Badge */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-border/40 pb-6">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-textSecondary">Active Shipment</span>
                  <h2 className="font-serif text-lg md:text-xl text-textPrimary mt-1 flex items-baseline gap-1.5">
                    Order <span className="font-mono text-xs md:text-sm uppercase tracking-wider font-normal text-textSecondary select-all">#{order.id.toUpperCase()}</span>
                  </h2>
                  <div className="flex items-center gap-2 text-textSecondary mt-2">
                    <Calendar size={14} />
                    <span className="font-sans text-xs">Placed on {order.date}</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border ${getStatusBadgeColor(order.status)}`}>
                    {order.status || 'Processing'}
                  </span>
                </div>
              </div>

              {/* Conditional Special Status Banners */}
              {order.status === 'Cancelled' && (
                <div className="bg-red-50 border border-red-200/30 p-4 rounded-lg flex items-center gap-3 text-red-800">
                  <AlertCircle className="shrink-0 text-red-600" size={20} />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">This order has been cancelled.</span>
                    <span className="text-xs text-red-700/80">If you have already paid or need assistance, please contact support.</span>
                  </div>
                </div>
              )}

              {order.status === 'Exchange Requested' && (
                <div className="bg-purple-50 border border-purple-200/30 p-4 rounded-lg flex items-center gap-3 text-purple-800">
                  <AlertCircle className="shrink-0 text-purple-600" size={20} />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Exchange Requested</span>
                    <span className="text-xs text-purple-700/80 font-sans mt-0.5">We have received your exchange request and will notify you when it is processed.</span>
                  </div>
                </div>
              )}

              {order.status === 'Exchanged' && (
                <div className="bg-emerald-50 border border-emerald-200/30 p-4 rounded-lg flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold">Order Exchanged</span>
                    <span className="text-xs text-emerald-700/80">The replacement items for this order have been successfully exchanged.</span>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div className="py-2 border-b border-border/40 pb-10">
                <h3 className="font-sans text-xs uppercase tracking-widest text-textSecondary mb-6">Delivery Progress</h3>
                
                {/* Desktop Horizontal Timeline */}
                <div className="hidden md:flex relative justify-between items-center w-full max-w-xl mx-auto px-4">
                  {/* Background Connection Line */}
                  <div className="absolute left-6 right-6 top-5 h-0.5 bg-gray-200/60 z-0"></div>
                  
                  {/* Active Connection Line Progress */}
                  <div 
                    className="absolute left-6 top-5 h-0.5 bg-textPrimary z-0 transition-all duration-1000 ease-lux"
                    style={{ 
                      width: getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active' 
                        ? 'calc(100% - 3rem)' 
                        : getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active' 
                        ? '50%' 
                        : '0%' 
                    }}
                  ></div>

                  {/* Processing */}
                  <div className="flex flex-col items-center gap-3 relative z-10 px-2 bg-bgCard">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      getStepStatus('Processing') === 'completed' || getStepStatus('Processing') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <Box size={18} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-sans text-[10px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Processing') === 'completed' || getStepStatus('Processing') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Processing</span>
                      <span className="font-sans text-[9px] text-textSecondary mt-0.5">Order Placed</span>
                    </div>
                  </div>

                  {/* Shipped */}
                  <div className="flex flex-col items-center gap-3 relative z-10 px-2 bg-bgCard">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <Truck size={18} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-sans text-[10px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Shipped</span>
                      <span className="font-sans text-[9px] text-textSecondary mt-0.5">In Transit</span>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="flex flex-col items-center gap-3 relative z-10 px-2 bg-bgCard">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className={`font-sans text-[10px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Delivered</span>
                      <span className="font-sans text-[9px] text-textSecondary mt-0.5">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Vertical Timeline */}
                <div className="md:hidden flex flex-col gap-8 relative pl-10 py-4 max-w-sm mx-auto">
                  {/* Background Connection Line */}
                  <div className="absolute left-[1.125rem] top-6 bottom-6 w-0.5 bg-gray-200/60 z-0"></div>
                  
                  {/* Active Connection Line Progress */}
                  <div 
                    className="absolute left-[1.125rem] top-6 w-0.5 bg-textPrimary z-0 transition-all duration-1000 ease-lux"
                    style={{ 
                      height: getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active' 
                        ? 'calc(100% - 3rem)' 
                        : getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active' 
                        ? '50%' 
                        : '0%' 
                    }}
                  ></div>

                  {/* Processing Step */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                      getStepStatus('Processing') === 'completed' || getStepStatus('Processing') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <Box size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Processing') === 'completed' || getStepStatus('Processing') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Processing</span>
                      <span className="font-sans text-xs text-textSecondary mt-0.5">Preparing items for shipping.</span>
                    </div>
                  </div>

                  {/* Shipped Step */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                      getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <Truck size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Shipped') === 'completed' || getStepStatus('Shipped') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Shipped</span>
                      <span className="font-sans text-xs text-textSecondary mt-0.5">Package in transit.</span>
                    </div>
                  </div>

                  {/* Delivered Step */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                      getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active'
                        ? 'border-textPrimary bg-textPrimary text-white shadow-sm'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-sans text-[11px] uppercase tracking-widest font-semibold ${
                        getStepStatus('Delivered') === 'completed' || getStepStatus('Delivered') === 'active'
                          ? 'text-textPrimary font-bold'
                          : 'text-textSecondary'
                      }`}>Delivered</span>
                      <span className="font-sans text-xs text-textSecondary mt-0.5">Package delivered successfully.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column details: Shipping vs Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                
                {/* Shipping info */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                    <MapPin size={16} className="text-textSecondary" />
                    <h3 className="font-sans text-xs uppercase tracking-widest text-textPrimary font-semibold">Delivery Address</h3>
                  </div>
                  <div className="font-sans text-sm text-textPrimary flex flex-col gap-1.5 pl-1">
                    <span className="font-semibold text-base">{order.customer}</span>
                    <span className="text-textSecondary leading-relaxed">{order.address}</span>
                    <div className="flex flex-col gap-0.5 mt-2 text-xs text-textSecondary pt-2 border-t border-border/30">
                      <span>Email: {order.email}</span>
                      <span>Phone: {order.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Order items list */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-border/30 pb-2">
                    <Package size={16} className="text-textSecondary" />
                    <h3 className="font-sans text-xs uppercase tracking-widest text-textPrimary font-semibold">Items Ordered</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center group">
                        <div className="w-12 h-16 bg-gray-50 border border-border/60 shrink-0 rounded-sm overflow-hidden shadow-sm">
                          {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-serif text-sm truncate text-textPrimary font-medium">{item.title}</span>
                          <div className="flex gap-3 font-sans text-[10px] text-textSecondary uppercase mt-1">
                            <span>Qty: {item.quantity}</span>
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        </div>
                        <span className="font-sans text-sm text-textPrimary font-semibold shrink-0">
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : (!isNaN(Number(String(item.price).replace(/[^0-9.]/g, ''))) ? Number(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2) : '0.00')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-border/30 pt-4 mt-2">
                    <span className="font-sans text-xs uppercase tracking-widest text-textSecondary">Total Amount Paid</span>
                    <span className="font-serif text-lg font-bold text-textPrimary">₹{order.total?.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
