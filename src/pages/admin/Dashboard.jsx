import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Activity } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    customers: 0,
  });

  useEffect(() => {
    // Fetch all orders for stats
    const qAll = query(collection(db, 'orders'));
    const unsubAll = onSnapshot(qAll, (snapshot) => {
      let totalRev = 0;
      let uniqueCustomers = new Set();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status !== 'Cancelled') {
          totalRev += (data.total || 0);
        }
        if (data.email) {
          uniqueCustomers.add(data.email);
        }
      });

      setStats({
        revenue: totalRev,
        totalOrders: snapshot.size,
        customers: uniqueCustomers.size
      });
    });

    // Fetch recent 5 orders for table
    const qRecent = query(collection(db, 'orders'), orderBy('timestamp', 'desc'), limit(5));
    const unsubRecent = onSnapshot(qRecent, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentOrders(orders);
    });

    return () => {
      unsubAll();
      unsubRecent();
    };
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} icon={DollarSign} trend="+12.5%" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} trend="+5.2%" />
        <StatCard title="Active Customers" value={stats.customers} icon={Users} trend="+2.4%" />
        <StatCard title="Conversion Rate" value="3.2%" icon={Activity} trend="-1.1%" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-serif mb-4 text-gray-900">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-[#FAF9F6] border-b border-gray-200">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-6 py-4">{order.customer || 'Unknown Customer'}</td>
                  <td className="px-6 py-4">{formatDate(order.timestamp)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">₹{(order.total || 0).toFixed(2)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
