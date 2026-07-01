import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, MoreHorizontal, X, Package } from 'lucide-react';
import InvoiceTemplate from '../../components/admin/InvoiceTemplate';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrdersData(orders);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Exchange Requested': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePaymentVerification = async (orderId, isVerified) => {
    try {
      const updateData = { paymentVerified: isVerified };
      if (isVerified === false) {
        updateData.status = 'Cancelled';
      } else if (isVerified === null) {
        updateData.status = 'Processing';
      }
      await updateDoc(doc(db, 'orders', orderId), updateData);
    } catch (error) {
      console.error("Error updating payment verification: ", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif text-gray-900">Orders</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-gray-400 text-sm text-gray-900"
            />
          </div>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-black transition-colors">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs uppercase tracking-wider text-gray-900">{order.id.toUpperCase()}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  {order.paymentVerified === null ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 mr-2">Payment Received?</span>
                      <button 
                        onClick={() => handlePaymentVerification(order.id, true)}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-xs transition-colors"
                      >
                        Yes
                      </button>
                      <button 
                        onClick={() => handlePaymentVerification(order.id, false)}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-xs transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${order.paymentVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {order.paymentVerified ? 'Payment Verified' : 'Payment Not Received'}
                        </span>
                        <button 
                          onClick={() => handlePaymentVerification(order.id, null)}
                          className="text-[10px] text-gray-500 hover:text-gray-900 underline"
                        >
                          Undo
                        </button>
                      </div>
                      
                      {order.paymentVerified && (
                        <select 
                          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer border-none outline-none appearance-none w-fit ${getStatusColor(order.status)}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option className="bg-white text-gray-900" value="Processing">Processing</option>
                          <option className="bg-white text-gray-900" value="Shipped">Shipped</option>
                          <option className="bg-white text-gray-900" value="Delivered">Delivered</option>
                          <option className="bg-white text-gray-900" value="Cancelled">Cancelled</option>
                          <option className="bg-white text-gray-900" value="Exchange Requested">Exchange Requested</option>
                          <option className="bg-white text-gray-900" value="Exchanged">Exchanged</option>
                        </select>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-900">₹{order.total.toFixed(2)}</td>
                <td className="px-6 py-4 flex justify-end gap-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600" 
                    title="Generate Invoice"
                  >
                    <FileText size={18} />
                  </button>
                  <button 
                    onClick={() => setViewOrder(order)}
                    className="p-2 hover:bg-gray-200 rounded-md transition-colors text-gray-600" 
                    title="View Full Details"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden Invoice Component for generation */}
      {selectedOrder && (
        <InvoiceTemplate order={selectedOrder} onComplete={() => setSelectedOrder(null)} />
      )}

      {/* Order Details Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-serif text-gray-900">Order #{viewOrder.id}</h2>
                <p className="text-sm text-gray-500 mt-1">{viewOrder.date}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAF9F6] space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{viewOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p>{viewOrder.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <p>{viewOrder.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                    <p>{viewOrder.address || 'No address provided'}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900">
                  <Package size={18} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider">Order Items</h3>
                </div>
                
                <div className="space-y-4">
                  {viewOrder.items && viewOrder.items.length > 0 ? (
                    viewOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-4 p-3 border border-gray-50 rounded-lg bg-gray-50/50">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-md" />
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          <p className="font-medium text-gray-900">{item.title || item.name}</p>
                          <div className="flex gap-4 mt-1 text-xs text-gray-500">
                            <span>Size: {item.size || 'N/A'}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{Number(item.price).toFixed(2)}</span>
                          </div>
                          
                          {/* Customization Details (If any) */}
                          {item.customSize && (
                            <div className="mt-2 p-2 bg-yellow-50/50 border border-yellow-100 rounded text-xs text-yellow-800">
                              <p className="font-medium mb-1">Custom Measurements:</p>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {Object.entries(item.customSize).map(([k, v]) => (
                                  <span key={k} className="capitalize">{k}: {v}"</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-gray-900 flex items-center">
                          ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No items found for this order.</p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm text-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Payment Summary</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(viewOrder.subtotal || viewOrder.total).toFixed(2)}</span>
                  </div>
                  {(viewOrder.discount > 0) && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{viewOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-100 mt-2">
                    <span>Total Paid</span>
                    <span>₹{viewOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
